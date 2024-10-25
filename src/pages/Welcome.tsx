import { Line } from '@ant-design/charts';
import { getBusinessCount, getBusinessConsumption, getRevenueData, getSmsData } from '@/services/ant-design-pro/api';

import { EditOutlined, FundOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Link, useModel } from '@umijs/max';
import { Button, Card, theme, Radio } from 'antd';
import { createStyles } from 'antd-style';
import React, { useEffect, useRef, useState } from 'react';
import { Column } from '@ant-design/plots';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';

const data = [
  { type: '已注册企业', value: 100 },
  { type: '认证企业', value: 200 },
  { type: '未认证企业', value: 20 },
  { type: '待提交认证企业', value: 102 },
  { type: '认证中企业', value: 88 },
  { type: '认证未通过企业', value: 3 },
];




const Welcome: React.FC = () => {
  const { styles } = useStyles();
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  const [businessCountArr, setBusinessCount] = useState([]);
  const [businessConsumptionArr, setBusinessConsumption] = useState([]); // 企业消费图表
  const [revenueArr, setRevenue] = useState([]); // 企业消费图表
  // 企业消费tab切换
  const [activeTab, setActiveTab] = useState('1');
  // 平台营收tab
  const [activeRevenueTab, setRevenueActiveTab] = useState('2');
  // 平台短信条数tab
  const [activeSMSTab, setSMSActiveTab] = useState('2');
  // 平台短信条数数据
  const [smsCountArr, setSmsCount] = useState([]); // 企业消费图表



  const onTabChange = (e: RadioChangeEvent) => {
    setActiveTab(e.target.value);
  };
  const onRevenueTabChange = (e: RadioChangeEvent) => {
    setRevenueActiveTab(e.target.value);
  };
  const onSmsTabChange = (e: RadioChangeEvent) => {
    setSMSActiveTab(e.target.value);
  };

  useEffect(() => {
    getBusinessCount().then(res => {
      setBusinessCount(res.list)
    })
    getBusinessConsumption({
      type: activeTab
    }).then(res => {
      setBusinessConsumption(res.list)
    })
    getRevenueData({
      type: activeRevenueTab
    }).then(res => {
      setRevenue(res.list)
    })
    getSmsData({
      type: activeSMSTab
    }).then(res => {
      setSmsCount(res.list)
    })
  }, [])
  // 柱状图
  const BarChart = () => {
    // ECharts 的配置项
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: businessCountArr.map(item => item.statusDesc),
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '平台企业数量',
          type: 'bar',
          barWidth: '60%',
          data: businessCountArr.map(item => item.count)
        }
      ]
    };

    return <ReactEcharts option={option} />;
  };
  // 平台企业消费折线图
  const LineChart1 = () => {
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data:['平台企业消费'],
        bottom: -5,
    },
      xAxis: {
        type: 'category',
        data: businessConsumptionArr.map(item => item.date)
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '12%',
        top:'5%',
        containLabel: true
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {

          name: '平台企业消费',
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          smooth: true,
          label: {
            show: true,
            position: 'top'
          }
        }
      ]
    };
    return <ReactEcharts option={option} />;
  }
  // 平台企业消费折线图
  const LineChart2 = () => {
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data:['平台营收'],
        bottom: -5,
    },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '12%',
        top:'5%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: revenueArr.map(item => item.date)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '平台营收',
          data: revenueArr.map(item => item.revenue),
          type: 'line',
          smooth: true,
          label: {
            show: true,
            position: 'top'
          }
        }
      ]
    };
    return <ReactEcharts option={option} />;
  }
  // 平台短信条数
  const LineChart3 = () => {
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data:['平台接收短信（条）,平台发送短信（条）'],
        bottom: -5,
    },
      xAxis: {
        type: 'category',
        data: smsCountArr.map(item => item.date)
      },
      yAxis: {
        type: 'value'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '12%',
        top:'5%',
        containLabel: true
      },
      series: [
        {
          name: '平台接收短信（条）',
          data: smsCountArr.map(item => item.receiveCount),
          type: 'line',
          smooth: true,
          label: {
            show: true,
            position: 'top'
          }
        },
        {
          name: '平台发送短信（条）',
          data: smsCountArr.map(item => item.sendCount),
          type: 'line',
          smooth: true,
          label: {
            show: true,
            position: 'top'
          }
        }
      ]
    };
    return <ReactEcharts option={option} />;
  }


  const data = [
    { year: '1991', value: 3 },
    { year: '1992', value: 4 },
    { year: '1993', value: 3.5 },
    { year: '1994', value: 5 },
    { year: '1995', value: 4.9 },
    { year: '1996', value: 6 },
    { year: '1997', value: 7 },
    { year: '1998', value: 9 },
    { year: '1999', value: 13 },
  ];
  const config = {
    data,
    height: 200,
    xField: 'year',
    yField: 'value',
  };
  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 8,
        }}
        bodyStyle={{
          backgroundImage:
            initialState?.settings?.navTheme === 'realDark'
              ? 'background-image: linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
              : 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
        }}
      >
        <div
          style={{
            backgroundPosition: '100% -30%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '274px auto',
            backgroundImage:
              "url('https://gw.alipayobjects.com/mdn/rms_a9745b/afts/img/A*BuFmQqsB2iAAAAAAAAAAAAAAARQnAQ')",
          }}
        >
          <div
            style={{
              fontSize: '20px',
              color: token.colorTextHeading,
            }}
          >
            欢迎使用杰讯互联短信管理平台
          </div>
          <p
            style={{
              fontSize: '14px',
              color: token.colorTextSecondary,
              lineHeight: '22px',
              marginTop: 16,
              marginBottom: 32,
              width: '65%',
            }}
          >
            Ant Design Pro 是一个整合了 umi，Ant Design 和 ProComponents
            的脚手架方案。致力于在设计规范和基础组件的基础上，继续向上构建，提炼出典型模板/业务组件/配套设计资源，进一步提升企业级中后台产品设计研发过程中的『用户』和『设计者』的体验。
          </p>
        </div>
      </Card>
      <Card
        style={{
          borderRadius: 8,
          marginTop: 10,
        }}
        bodyStyle={{
          backgroundImage:
            initialState?.settings?.navTheme === 'realDark'
              ? 'background-image: linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
              : 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
              width: '100%',
            }}
          >
            <FundOutlined style={{ fontSize: 18 }} />
            <span style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>数据看板</span>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ width: '50%', height: '300px' }}>
              <BarChart />
            </div>
            <div style={{ width: '50%', height: '300px' }}>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', position: 'relative', }}>
                <Radio.Group value={activeTab} onChange={onTabChange} style={{}}>
                  <Radio.Button value="1">近七日</Radio.Button>
                  <Radio.Button value="2">按月</Radio.Button>
                  <Radio.Button value="3">按年</Radio.Button>
                </Radio.Group>
              </div>
              <LineChart1 />
            </div>
            <div style={{ width: '100%', height: '300px',marginTop:'10px' }}>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', position: 'relative', }}>
                <Radio.Group value={activeRevenueTab} onChange={onRevenueTabChange} style={{ marginTop: 10, marginRight: 30 }}>
                  <Radio.Button value="2">当月</Radio.Button>
                  <Radio.Button value="3">当年</Radio.Button>
                </Radio.Group>
              </div>
              <LineChart2 />
            </div>
            <div style={{ width: '100%', height: '300px',marginTop:'25px' }}>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', position: 'relative', }}>
                <Radio.Group value={activeSMSTab} onChange={onSmsTabChange} style={{ marginTop: 10, marginRight: 30 }}>
                  <Radio.Button value="2">当月</Radio.Button>
                  <Radio.Button value="3">当年</Radio.Button>
                </Radio.Group>
              </div>
              <LineChart3 />
            </div>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

const useStyles = createStyles(({ token }) => {
  return {
    tabs: {
      backgroundColor: 'red'
    },
    chart1_active: {
      background: 'pink',
      padding: '5px 10px',
      borderRadius: '2px'
    },
    action: {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 8px',
      cursor: 'pointer',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
  };
});

export default Welcome;
