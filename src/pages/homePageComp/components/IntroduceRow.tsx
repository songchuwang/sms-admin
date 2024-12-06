import React, { useState } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Area, Column } from '@ant-design/plots';
import { Col, Progress, Row, Tooltip, Tabs,Radio } from 'antd';
import numeral from 'numeral';
import type { DataItem } from '../data.d';
import useStyles from '../style.style';
import Yuan from '../utils/Yuan';
import { ChartCard, Field } from './Charts';
import Trend from './Trend';
const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 8,
  style: {
    marginBottom: 24,
  },
};
const topColResponsiveProps2 = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 24,
  style: {
    height:200,
    marginBottom: 24,
  },
};
const IntroduceRow = ({ loading, visitData,revenueArr,businessConsumptionArr }: { loading: boolean; visitData: DataItem[] }) => {
  const { styles } = useStyles();
  const [size, setSize] = useState('small');

  const onChange = (e: RadioChangeEvent) => {
    setSize(e.target.value);
  };
  return (
    <Row gutter={24}>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title="总营收额"
          action={
            // <Tooltip title="指标说明">
            //   <InfoCircleOutlined />
            // </Tooltip>
            <Radio.Group size='small' value={size} onChange={onChange} style={{ marginBottom: 16 }}>
              <Radio.Button value="small">当月</Radio.Button>
              <Radio.Button value="middle">当年</Radio.Button>
            </Radio.Group>
          }
          loading={loading}
          total={() => <Yuan>126560</Yuan>}
          footer={<Field label="当月销售额" value={`￥${numeral(12423).format('0,0')}`} />}
          contentHeight={46}
        >
          <Trend
            flag="up"
            style={{
              marginRight: 16,
            }}
          >
            同比
            <span className={styles.trendText}>12%</span>
          </Trend>
          {/* <Trend flag="down">
            日同比
            <span className={styles.trendText}>11%</span>
          </Trend> */}
        </ChartCard>
      </Col>

      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title="营收曲线"
          action={
            <Radio.Group size='small' value={size} onChange={onChange} style={{ marginBottom: 16 }}>
              <Radio.Button value="small">当月</Radio.Button>
              <Radio.Button value="middle">当年</Radio.Button>
            </Radio.Group>
          }
          footer={
            <Field
              label="月营收额"
              value={
                revenueArr
                  .map((item) => item.revenue)
                  .reduce((accumulator, currentValue) => accumulator + currentValue, 0) + '元'
              }
            />
          }
          contentHeight={88}
        >
          <Area
            xField="date"
            yField="revenue"
            shapeField="smooth"
            height={88}
            axis={false}
            style={{
              fill: 'linear-gradient(-90deg, white 0%, #975FE4 100%)',
              fillOpacity: 0.6,
              width: '100%',
            }}
            colorField="showField"
            // {...config}
            padding={-20}
            data={revenueArr}
          />
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title="平台企业消费"
          action={
            <Radio.Group size='small' value={size} onChange={onChange} style={{ marginBottom: 16 }}>
              <Radio.Button value="small">近七日</Radio.Button>
              <Radio.Button value="small">按月</Radio.Button>
              <Radio.Button value="middle">按年</Radio.Button>
            </Radio.Group>
          }
          footer={
            <Field
              label="月营收额"
              value={
                businessConsumptionArr
                  .map((item) => item.consumption)
                  .reduce((accumulator, currentValue) => accumulator + currentValue, 0) + '元'
              }
            />
          }
          contentHeight={88}
        >
          <Area
            xField="date"
            yField="consumption"
            shapeField="smooth"
            height={88}
            axis={false}
            style={{
              fill: 'linear-gradient(-90deg, white 0%, #975FE4 100%)',
              fillOpacity: 0.6,
              width: '100%',
            }}
            colorField="showField"
            // {...config}
            padding={-20}
            data={businessConsumptionArr}
          />
        </ChartCard>
      </Col>
      {/* <Col  {...topColResponsiveProps2}>
        <ChartCard
          bordered={false}
          loading={loading}
          title="平台企业消费2"
          action={
            <Radio.Group size='small' value={size} onChange={onChange} style={{ marginBottom: 16 }}>
              <Radio.Button value="small">近七日</Radio.Button>
              <Radio.Button value="small">按月</Radio.Button>
              <Radio.Button value="middle">按年</Radio.Button>
            </Radio.Group>
          }
          footer={
            <Field
              label="月营收额"
              value={
                businessConsumptionArr
                  .map((item) => item.consumption)
                  .reduce((accumulator, currentValue) => accumulator + currentValue, 0) + '元'
              }
            />
          }
          contentHeight={88}
        >
          <Area
            xField="date"
            yField="consumption"
            shapeField="smooth"
            height={88}
            axis={false}
            style={{
              fill: 'linear-gradient(-90deg, white 0%, #975FE4 100%)',
              fillOpacity: 0.6,
              width: '100%',
            }}
            colorField="showField"
            // {...config}
            padding={-20}
            data={businessConsumptionArr}
          />
        </ChartCard>
      </Col> */}
      {/* <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title="支付笔数"
          action={
            <Tooltip title="指标说明">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={numeral(6560).format('0,0')}
          footer={<Field label="转化率" value="60%" />}
          contentHeight={46}
        >
          <Column
            xField="x"
            yField="y"
            padding={-20}
            axis={false}
            height={46}
            data={visitData}
            scale={{ x: { paddingInner: 0.4 } }}
          />
        </ChartCard>
      </Col> */}
      
    </Row>
  );
};
export default IntroduceRow;
