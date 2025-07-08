/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'

interface Transaction {
  id: string
  amount: number
  description: string
  department: string
  transaction_date: string
  hash: string
  transaction_mint_date: string
}

interface ApiResponse {
  message: string
  storedData: Transaction[]
}


const sampleTransactions: Transaction[] = [
  {
    id: "sample001",
    amount: 50000000,
    description: "Medical Equipment Procurement",
    department: "Ministry of Health",
    transaction_date: "2024-01-15T00:00:00.000Z",
    hash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890",
    transaction_mint_date: "2024-01-15T10:30:00.000Z"
  },
  {
    id: "sample002",
    amount: 125000000,
    description: "School Infrastructure Development",
    department: "Ministry of Education",
    transaction_date: "2024-01-14T00:00:00.000Z",
    hash: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab",
    transaction_mint_date: "2024-01-14T14:45:00.000Z"
  },
  {
    id: "sample003",
    amount: 75000000,
    description: "Road Maintenance Contract",
    department: "Ministry of Transportation",
    transaction_date: "2024-01-13T00:00:00.000Z",
    hash: "0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd",
    transaction_mint_date: "2024-01-13T09:15:00.000Z"
  }
]


async function fetchTransactions(): Promise<{ transactions: Transaction[], error: string | null }> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/transactions`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch transactions')
    }
    
    const data: ApiResponse = await response.json()
    
    let transactionData = Array.isArray(data.storedData) ? data.storedData : [data.storedData]
    

    transactionData = transactionData.filter(t => t && t.id && t.amount && t.description)
    

    if (transactionData.length === 0) {
      console.log('No valid transaction data found, using sample data')
      return { transactions: sampleTransactions, error: 'No transactions found - showing sample data' }
    } else {
      return { transactions: transactionData, error: null }
    }
  } catch (err) {
    console.error('Fetch error:', err)
    return { transactions: sampleTransactions, error: 'Error connecting to server - showing sample data' }
  }
}


const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}


const formatAmount = (amount: number) => {
  return `Rs. ${amount.toLocaleString()}`
}

export default function TransactionsPage({ searchParams }: { searchParams: { tab?: string } }) {
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions)
  const [error, setError] = useState<string | null>('No transactions found - showing sample data')
  const [verifyingStates, setVerifyingStates] = useState<{[key: string]: 'idle' | 'verifying' | 'verified' | 'error'}>({})
  const activeTab = searchParams.tab || 'track'

  // Verify transaction function
  const verifyTransaction = async (transactionHash: string, transactionId: string) => {
    setVerifyingStates(prev => ({ ...prev, [transactionId]: 'verifying' }))
    
    try {
      const response = await fetch(`/api/verify/${transactionHash}`)
      const result = await response.json()
      
      if (response.ok && result === true) {
        setVerifyingStates(prev => ({ ...prev, [transactionId]: 'verified' }))
      } else {
        setVerifyingStates(prev => ({ ...prev, [transactionId]: 'error' }))
      }
    } catch (err) {
      console.error('Verification error:', err)
      setVerifyingStates(prev => ({ ...prev, [transactionId]: 'error' }))
    }
  }

  // Get verify button content based on state
  const getVerifyButtonContent = (transaction: Transaction) => {
    const state = verifyingStates[transaction.id] || 'idle'
    
    switch (state) {
      case 'verifying':
        return (
          <Button variant="outline" size="sm" className='w-full border-blue-500/50 bg-transparent text-blue-400 text-xs font-medium cursor-not-allowed' disabled>
            Verifying...
          </Button>
        )
      case 'verified':
        return (
          <Button variant="outline" size="sm" className='w-full border-green-500/50 bg-green-500/10 text-green-400 hover:bg-green-500/20 text-xs font-medium cursor-default' disabled>
            ✓ Verified
          </Button>
        )
      case 'error':
        return (
          <Button variant="outline" size="sm" className='w-full border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium cursor-default' disabled>
            ✗ Error
          </Button>
        )
      default:
        return (
          <Button 
            variant="outline" 
            size="sm" 
            className='w-full border-green-500/50 bg-transparent text-green-400 hover:bg-green-500/10 hover:text-green-300 hover:border-green-400 text-xs font-medium cursor-pointer'
            onClick={() => verifyTransaction(transaction.hash, transaction.id)}
          >
            Verify
          </Button>
        )
    }
  }

  return (
    <div className='min-h-screen bg-black text-white'>
      {/* Navigation */}
      <nav className='border-b border-white/10 p-6'>
        <div className='max-w-7xl mx-auto flex justify-between items-center'>
          <Link href="/" className='text-2xl font-bold text-white'>
            Gov<span className='text-violet-400'>Trace</span>
          </Link>
          <div className='hidden md:flex space-x-8 text-white/80'>
            <Link href="/" className='hover:text-violet-400 transition-colors'>Home</Link>
            <Link href="/transactions" className='text-violet-400'>Transactions</Link>
            <Link href="#" className='hover:text-violet-400 transition-colors'>Analytics</Link>
            <Link href="#" className='hover:text-violet-400 transition-colors'>Reports</Link>
          </div>
        </div>
      </nav>

      <div className='max-w-7xl mx-auto px-6 py-12'>
        {/* Page Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold mb-4'>Government Transactions</h1>
          <p className='text-white/70 text-lg'>Track and manage government financial transactions on the blockchain</p>
        </div>

        {/* Tab Navigation */}
        <div className='flex space-x-1 mb-8 bg-white/5 rounded-lg p-1 w-fit'>
          <Link 
            href="/transactions?tab=track" 
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === 'track' 
                ? 'bg-violet-600 text-white' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Track Transactions
          </Link>
          <Link 
            href="/transactions?tab=add" 
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === 'add' 
                ? 'bg-violet-600 text-white' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Add Transaction
          </Link>
        </div>

        {/* Tab Content */}
        {activeTab === 'track' && (
          <div className='space-y-6'>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
              <h2 className='text-2xl font-semibold'>Transaction History</h2>
              <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto'>
                <input
                  type='text'
                  placeholder='Search transactions...'
                  className='px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-violet-400 min-w-0 sm:min-w-[240px]'
                />
                <div className='flex gap-2'>
                  <Button variant="outline" className='border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white hover:border-violet-400 whitespace-nowrap cursor-pointer'>
                    Filter
                  </Button>
                  <Button variant="default" className='bg-violet-600 hover:bg-violet-700 whitespace-nowrap cursor-pointer'>
                    Refresh
                  </Button>
                </div>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className='bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 text-center'>
                <p className='text-yellow-400 font-medium'>{error}</p>
              </div>
            )}

            {/* Transactions Table */}
            <div className='bg-white/5 rounded-lg overflow-hidden'>
              {transactions.length === 0 ? (
                <div className='p-12 text-center'>
                  <p className='text-white/70 text-lg'>No transactions available</p>
                  <p className='text-white/50 text-sm mt-2'>Check your connection or try refreshing</p>
                </div>
              ) : (
                <table className='w-full'>
                  <thead className='bg-white/10'>
                    <tr>
                      <th className='px-6 py-4 text-left font-semibold'>Transaction ID</th>
                      <th className='px-6 py-4 text-left font-semibold'>Department</th>
                      <th className='px-6 py-4 text-left font-semibold'>Description</th>
                      <th className='px-6 py-4 text-left font-semibold'>Amount</th>
                      <th className='px-6 py-4 text-left font-semibold'>Date</th>
                      
                      <th className='px-6 py-4 text-left font-semibold'>Verify Staus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className='border-t border-white/10 hover:bg-white/5'>
                        <td className='px-6 py-4 font-mono text-violet-400 text-sm'>
                          {transaction.id.substring(0, 8)}...
                        </td>
                        <td className='px-6 py-4'>{transaction.department}</td>
                        <td className='px-6 py-4'>{transaction.description}</td>
                        <td className='px-6 py-4 font-semibold'>{formatAmount(transaction.amount)}</td>
                        <td className='px-6 py-4'>{formatDate(transaction.transaction_date)}</td>
                        
                        <td className='px-6 py-4'>
                          {getVerifyButtonContent(transaction)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === 'add' && (
          <div className='max-w-2xl'>
            <h2 className='text-2xl font-semibold mb-6'>Add New Transaction</h2>
            
            <form className='space-y-8'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <label className='block text-sm font-medium text-white'>Ministry/Department</label>
                  <Select>
                    <SelectTrigger className='h-12 w-full bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-violet-400'>
                      <SelectValue placeholder="Select Ministry" />
                    </SelectTrigger>
                    <SelectContent className='bg-white/10 border-white/10 backdrop-blur-2xl'>
                      <SelectItem value="health" className='text-white hover:bg-gray-800'>Ministry of Health</SelectItem>
                      <SelectItem value="education" className='text-white hover:bg-gray-800'>Ministry of Education</SelectItem>
                      <SelectItem value="transport" className='text-white hover:bg-gray-800'>Ministry of Transportation</SelectItem>
                      <SelectItem value="defense" className='text-white hover:bg-gray-800'>Ministry of Defense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className='space-y-2'>
                  <label className='block text-sm font-medium text-white'>Transaction Amount</label>
                  <input
                    type='text'
                    placeholder='Rs. 0.00'
                    className='py-2 w-full px-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-violet-400'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <label className='block text-sm font-medium text-white'>Transaction Description</label>
                <textarea
                  rows={4}
                  placeholder='Enter detailed description of the transaction...'
                  className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-violet-400 resize-none'
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <label className='block text-sm font-medium text-white'>Transaction Type</label>
                  <Select>
                    <SelectTrigger className='h-12 w-full bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-violet-400'>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent className='bg-white/10 border-white/10 backdrop-blur-2xl'>
                      <SelectItem value="procurement" className='text-white hover:bg-gray-800'>Procurement</SelectItem>
                      <SelectItem value="salary" className='text-white hover:bg-gray-800'>Salary Payment</SelectItem>
                      <SelectItem value="infrastructure" className='text-white hover:bg-gray-800'>Infrastructure</SelectItem>
                      <SelectItem value="welfare" className='text-white hover:bg-gray-800'>Social Welfare</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className='space-y-2'>
                  <label className='block text-sm font-medium text-white'>Priority Level</label>
                  <Select>
                    <SelectTrigger className='h-12 w-full bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-violet-400'>
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent className='bg-white/10 border-white/10 backdrop-blur-2xl'>
                      <SelectItem value="low" className='text-white hover:bg-gray-800'>Low</SelectItem>
                      <SelectItem value="medium" className='text-white hover:bg-gray-800'>Medium</SelectItem>
                      <SelectItem value="high" className='text-white hover:bg-gray-800'>High</SelectItem>
                      <SelectItem value="urgent" className='text-white hover:bg-gray-800'>Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className='space-y-2'>
                <label className='block text-sm font-medium text-white'>Supporting Documents</label>
                <div className='border-2 border-dashed border-gray-500/30 rounded-lg p-8 text-center bg-gray-800/20 relative'>
                  <div className='absolute top-3 right-3'>
                    <span className='bg-orange-500/20 text-orange-400 text-xs px-3 py-1 rounded-full font-medium'>
                      Coming Soon
                    </span>
                  </div>
                  <div className='text-gray-500 mb-3 opacity-50'>
                    <svg className='w-10 h-10 mx-auto mb-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' />
                    </svg>
                    <span className='text-base font-medium'>Document upload feature</span>
                  </div>
                  <p className='text-sm text-gray-500 opacity-50'>This feature will be available in future updates</p>
                </div>
              </div>

              <div className='flex flex-col sm:flex-row gap-4 pt-4'>
                <Button variant="default" className='h-12 flex-1 bg-violet-600 hover:bg-violet-700 text-white cursor-pointer font-medium'>
                  Submit Transaction
                </Button>
                <Button variant="outline" className='h-12 flex-1 border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white cursor-pointer font-medium'>
                  Save as Draft
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}