'use client'
import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function BarChartDashboard({budgetList}) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Safe copy of data to avoid rendering issues
  const safeData = budgetList || [];
  
  // Handle responsive width
  const [chartWidth, setChartWidth] = useState(1000);
  
  useEffect(() => {
    const handleResize = () => {
      // Set chart width based on container size
      if (window.innerWidth < 768) {
        setChartWidth(window.innerWidth - 60);
      } else {
        setChartWidth(Math.min(1000, window.innerWidth * 0.6));
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className='border p-5 rounded-lg'>
      <h2 className='text-2xl font-bold mb-5'>Activity Bar</h2>
      {isMounted ? (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={safeData}
            margin={{top:5,right:5,left:5,bottom:5}}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalSpend" stackId="a" fill="#1E3A8A" />
            <Bar dataKey="amount" stackId="a" fill="#BFDBFE" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="w-full h-[250px] bg-gray-100 animate-pulse rounded"></div>
      )}
    </div>
  )
}

export default BarChartDashboard