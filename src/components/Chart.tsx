
import { UseFilteredData } from "../Hooks/useFilteredData";
import { App, InputProp, Transaction, TransactionType } from "../interfaces/transaction";
import HighchartsReact from "highcharts-react-official";
import * as Highcharts from "highcharts";
import { Paper } from "@mui/material";

export default function Chart({type}:any) {
  const data = UseFilteredData();


  const options = {
    chart: {
      zooming: {
        type: 'x'
      }
    },
    responsive: {  
      rules: [{  
        condition: {  
          maxWidth: 100
        },  
        
      }]  
    },
    title:{
      text:''
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: 'Date'
      }
    },
    yAxis: {

      title: {
        text: 'Amount in Rupee'
      }
    },
    series: Object.keys(App).map((app)=>{
      return ({
        lineWidth: 1.5,
        smoothed: true,
       
        name: app + type,
        data: data?.combinedData.transactions.filter(d=>d.type === type && d.app === app).map(d => {
          return [d.date.getTime(), d.amount]
        })
      });
    
    })
  }
  return (
    <div>
      <Paper variant="elevation">
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          sx={{ maxWidth: 200, margin: '16px' ,height:200,overflow:'hidden'}}
        />
      </Paper>
    </div>
  )

}


export const PieChart = (props:InputProp)=>{
  const data = UseFilteredData();
  const options = {
   
    chart: {
      height:'70%',
    
      plotBackgroundColor: null,
      plotBorderWidth: 0,
      plotShadow: false,
      spacingTop:-50,
  },
  title: {
      text: `${props.app} <br>Transactions`,
      align: 'center',
      verticalAlign: 'middle',
      y: 60,
      style: {
          fontSize: '1.1em'
      }
  },
  tooltip: {
      pointFormat: '{series.name}: <b>₹{point.y}</b>'
  },
  accessibility: {
      point: {
          valueSuffix: '%'
      }
  },
  plotOptions: {
      pie: {
          dataLabels: {
              enabled: true,
              distance: -50,
              style: {
                  fontWeight: 'bold',
                  color: 'white'
              }
          },
          startAngle: -90,
          endAngle: 90,
          center: ['50%', '75%'],
          size: '110%'
      }
  },
  series: [{
      type: 'pie',
      name: 'Amount Transacted',
      innerSize: '50%',
      data: [
          ['Debited', data?.[props.app].totalDebited],
          ['Credited',  data?.[props.app].totalCredited],
        
      ]
  }]
  }
  return (
    <div>
      <Paper variant="elevation" sx={{ maxWidth: 400, margin: '16px' ,height:200,overflow:'hidden'}}>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          
        />
      </Paper>
    </div>
  )
}