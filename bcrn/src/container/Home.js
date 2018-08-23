import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import { createForm } from 'rc-form';
import { Card, WhiteSpace, Icon, Flex, List, InputItem, Picker, Stepper, Button } from 'antd-mobile-rn';

import styles from './Home.style.js'

const Item = List.Item;

@createForm()
@connect(state => ({
    home: state.home,
}))
export default class App extends PureComponent {

    handleReset = () => {
        const { resetFields } = this.props.form;
        resetFields();
    }
    
    handleSubmmit = () => {
        const { validateFields } = this.props.form;
        validateFields((error, value) => {
            if (error) {
                return;
            }
            console.info(value);
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

            value.finalCost = finalCost;
            // 更新state
            this.props.dispatch({
                type: 'home/calcuate',
                payload: {
                    finalCost 
                }
            });
        });

    };

    render() {
        const { getFieldProps } = this.props.form;
        const { exchange, commission, coverNumber, coverPrice, holdingNumber, holdingPrice, finalCost } = { ...this.props.home };

        return (
            <View>
                <WhiteSpace size="lg" />
                    <Card>
                        <Card.Header
                            title="补仓后成本价"
                            thumb={<Icon type={'\ue6ea'} size="xxs" color='#D71D05'/>}
                        />
                        <Card.Body style={{ padding:15 }}>
                            <Text style={{fontSize: 30, textAlign: 'center', color: '#D71D05'}}>{finalCost == 0 ? '-.-': finalCost }</Text>
                        </Card.Body>
                    </Card>
                <WhiteSpace size="lg" />
                <List>
                    <Picker title="交易所" cols={1} 
                            data={[{ value: 'SH', label: '上证' }, 
                                   { value: 'SZ', label: '深证' }
                                ]} 
                                {...getFieldProps('exchange', { initialValue: exchange })} 
                            >
                            <Item>
                                <Text><Icon type={'\ue626'} size="xxs"/> 交易所</Text>
                            </Item>
                    </Picker>

                    <Picker title="佣金" cols={1} 
                            data={[{ value: '0.0002', label: '万分之 2' }, 
                                    { value: '0.0025', label: '万分之 2.5' }, 
                                    { value: '0.0003', label: '万分之 3' }]} 
                                    {...getFieldProps('commission', { initialValue: commission, rules: [{ required: true, message: '持仓价格不可为空' }] })} 
                            >
                            <Item>
                                <Text><Icon type={'\ue627'} size="xxs"/>交易佣金</Text>
                            </Item>
                    </Picker>
                    <InputItem type="number" textAlign="right"  extra="元" labelPosition="left"
                        {...getFieldProps('holdingPrice', { initialValue: holdingPrice, rules: [{ required: true, message: '持仓价格不可为空' }] })} >
                        <Text><Icon type={'\ue600'} size="xxs"/>持仓价</Text>
                    </InputItem>
                    <Item extra={
                            <Stepper showNumber defaultValue={100} step={100} 
                            inputStyle={{ paddingBottom: 8 }} 
                            {...getFieldProps('holdingNumber', { initialValue: holdingNumber, required: true })} />
                        }>
                         <Text><Icon type={'\ue61f'} size="xxs"/>持仓数量</Text>
                    </Item>
                     {/* 第六行 补仓价格 */}
                    <InputItem type="number" textAlign="right"  extra="元" 
                        {...getFieldProps('coverPrice', { initialValue: coverPrice, rules: [{ required: true, message: '补仓价格不可为空' }] })} >
                        <Text><Icon type={'\ue600'} size="xxs"/> 补仓价</Text>
                    </InputItem>
                    <Item
                        extra={
                            <Stepper showNumber defaultValue={100} step={100} 
                            inputStyle={{ paddingBottom: 8 }} 
                            {...getFieldProps('coverNumber', { initialValue: coverNumber, required: true })} />
                        }>
                         <Text><Icon type={'\ue61f'} size="xxs"/>补仓数量</Text>
                    </Item>
                    <Item align="middle">
                        <Flex direction="row" justify="center" align="center">
                            <Button type="primary" 
                                    style={{ marginRight: 4, width: '48%' }}
                                    onClick={() => this.handleReset()}
                                    inline >重新计算</Button>

                            <Button type="ghost" onClick={() => this.handleSubmmit()} 
                                    style={{ width: '48%' }}
                                    inline 
                                    className="am-button-borderfix">计算成本</Button>
                        </Flex>
                    </Item>
                </List>
            </View>
        );
    }
}