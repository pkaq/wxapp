import React from 'react';
import { connect } from 'dva';
import 'normalize.css';
import { Radio } from 'antd';
import styles from './index.less';
import { Flex, NavBar, WingBlank, List, InputItem, Picker, Stepper, Button } from 'antd-mobile';
import { createForm } from 'rc-form';

const Item = List.Item;
const RadioGroup = Radio.Group;

@createForm()
@connect(state => ({
    home: state.home,
}))
export default class Home extends React.PureComponent {

    handleSubmmit = () => {
        const { validateFields } = this.props.form;

        validateFields((error, value) => {
            if (error) {
                return;
            }
            // 计算补仓价格
            // (第一次买入数量 * 买入价 + 第二次买入数量 * 买入价 + 交易费用[手续费+过户费]) / (第一次买入数量 + 第二次买入数量)
            // 上证过户费
            let transfer = 0;
            if (value.exchange === 'SH') {
                transfer = (value.coverNumber * value.coverPrice) * 0.0002;
            }
            // 计算佣金
            let charge = (value.coverNumber * value.coverPrice) * value.commission[0];
            charge = charge < 5 ? 5 : charge;

            let finalCost = ((value.holdingNumber * value.holdingPrice)
              + (value.coverNumber * value.coverPrice)
              + (charge + transfer))
              / (value.holdingNumber + value.coverNumber);
            finalCost = finalCost.toFixed(3);

            // 更新state
            value.finalCost = finalCost;
            this.props.dispatch({
                type: 'home/calcuate',
                payload: value
            });
        });
    };
    render() {
        const { getFieldProps, resetFields } = this.props.form;
        const { exchange, commission, coverNumber, coverPrice, holdingNumber, holdingPrice, finalCost } = { ...this.props.home };

        return (
            <div>
                <NavBar mode="dark">股票成本补仓计算器</NavBar>
                <WingBlank>
                    <List>
                        <Item extra={finalCost} className={styles.color_red}>补仓后成本价格：</Item>
                        {/* 第一行 */}
                        <Item extra={(
                            <RadioGroup {...getFieldProps('exchange', { initialValue: exchange })}>
                                <Radio value="SH">上证</Radio>
                                <Radio value="SZ">深证</Radio>
                            </RadioGroup>)}>
                         交易所
                        </Item>
                        {/* 第三行 */}
                        <Picker title="佣金" data={[{ value: 0.0002, label: '万分之 2' }, { value: 0.0025, label: '万分之 2.5' }, { value: 0.0003, label: '万分之 3' }]} cols={1}
                            {...getFieldProps('commission', { initialValue: commission, rules: [{ required: true, message: '持仓价格不可为空' }] })} >
                            <Item>交易佣金</Item>
                        </Picker>
                        {/* 第四行 持仓价格 */}
                        <InputItem {...getFieldProps('holdingPrice', { initialValue: holdingPrice, rules: [{ required: true, message: '持仓价格不可为空' }] })} >
                         持仓价格
                        </InputItem>
                        {/* 第五行 持仓数量 */}
                        <Item extra={
                            <Stepper showNumber defaultValue={100} step={100} {...getFieldProps('holdingNumber', { initialValue: holdingNumber, required: true })} />
                        }>
                          持仓数量
                        </Item>
                        {/* 第六行 补仓价格 */}
                        <InputItem clear {...getFieldProps('coverPrice', { initialValue: coverPrice, rules: [{ required: true, message: '补仓价格不可为空' }] })} >
                         持仓价格
                        </InputItem>
                        {/* 第七行 补仓数量 */}
                        <Item extra={
                            <Stepper showNumber defaultValue={100} step={100} {...getFieldProps('coverNumber', { initialValue: coverNumber, required: true })} />
                        }>
                         持仓数量
                        </Item>
                        <Item align="middle">
                            <Flex direction="row" justify="center" align="center">
                                <Button type="primary" inline style={{ marginRight: '4px', width: '100%' }}>重新计算</Button>
                                <Button type="ghost" onClick={() => this.handleSubmmit()} inline style={{ marginRight: '4px', width: '100%' }} className="am-button-borderfix">计算成本</Button>
                            </Flex>
                        </Item>
                    </List>
                </WingBlank>
            </div>
        );
    }
}
