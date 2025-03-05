import React from 'react'
import {Page, Text, View, Document, StyleSheet, Font} from "@react-pdf/renderer"
import RobotoMono from "./fonts/Roboto_Mono/RobotoMono-VariableFont_wght.ttf"

Font.register({
    family: 'Roboto',
    src: RobotoMono,
  });
const styles = StyleSheet.create({
    title:{
        fontSize:28,
        textAlign:"center",
        margin:20,
        color:"brown",
        fontFamily:"Roboto"

    },
    overallContainer:{
        display: "flex",
        flexDirection: "column", // Align items in a row
        justifyContent: "space-around", // Space elements evenly
        margin:40,
        padding: 10,
        borderRadius:5,
        height:350,
        paddingLeft: "2%",
        border:"2px solid black",
        fontFamily:"Roboto"
    },
    overallText:{
        display: "flex",
        alignItems: "center",
        height:"12%",
        borderBottom:"2px solid gray",
        fontSize:14
    },

    sourceContainer: {
      display: "flex",
      flexDirection: "column", // Align items in a row
      justifyContent: "space-around", // Space elements evenly
      margin:20,
      padding: 10,
      borderRadius:5,
      fontFamily:"Roboto",
      flexWrap:"wrap"
    },
    subheader:{
        borderBottom:"2px solid black",
        textAlign:"left",
        padding:10,
        fontSize:30,
        width:"100%",
        color:"rgb(137, 200, 129)",
    },
    source: {
        width:"100%",
        borderBottom:"2px solid gray",
        padding:10,
        textAlign:"left",
        fontSize:12
    },
    pageNumber:{
        position:"absolute",
        textAlign:"center",
        color:"gray",
        fontSize:16
    }
  });


const PdfFile = ({dateRange, currentBalance, projectIncome, projectExpense, projectBalance, incomeData, expenseData}) => {
  return (
    <Document>
    <Page size="A4">
        <Text style={styles.title}>Bonsai Summary Report</Text>
        <View style={styles.overallContainer}>
            <Text style={styles.overallText}>Projections ({dateRange})</Text>
            <Text style={styles.overallText}>Initial Account Balance: ${currentBalance}</Text>
            <Text style={styles.overallText}>Estimated Income through {dateRange}: ${projectIncome}</Text>
            <Text style={styles.overallText}>Estimated Expenses through {dateRange}: ${projectExpense}</Text>
            <Text style={styles.overallText}>Projected Account Balance: ${projectBalance}</Text>
        </View>
    </Page>
    <Page size="A4">
        <Text style={styles.title}>Bonsai Summary Report</Text>
        <View style={styles.sourceContainer} >
            <Text style={styles.subheader}>Income Summary</Text>
            {
                incomeData.map((point, i) =>(
                    <Text key={point+"-"+i} style={styles.source}>{point}</Text>
                ))
            }
        </View>
    </Page>
    <Page size="A4">
        <Text style={styles.title}>Bonsai Summary Report</Text>
        <View style={styles.sourceContainer}>
            <Text style={styles.subheader}>Expense Summary</Text>
            {
                expenseData.map((point, i) =>(
                    <Text key={point+"-"+i} style={styles.source}>{point}</Text>
                ))
            }
        </View>
    </Page>
    </Document>
  )
}

export default PdfFile