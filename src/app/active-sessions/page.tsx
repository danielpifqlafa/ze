'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Search, Trash2 } from 'lucide-react'
import { useActiveSession } from '@/contexts/ActiveSessionContext'

export default function ActiveSessions() {
  const { sessions, refreshSessions, addOrUpdateSession, navigateUser, deleteSession } = useActiveSession()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [filteredSessions, setFilteredSessions] = useState(sessions)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null)
  const [isPasswordProtected, setIsPasswordProtected] = useState(true)
  const [password, setPassword] = useState('')
  const [deleteAllConfirmOpen, setDeleteAllConfirmOpen] = useState(false)

  useEffect(() => {
    refreshSessions()
  }, [refreshSessions])

  useEffect(() => {
    let filtered = sessions.filter(session => session.page !== '/active-sessions')

    if (searchTerm) {
      filtered = filtered.filter(session =>
        session.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.page.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter) {
      filtered = filtered.filter(session => session.status === statusFilter)
    }

    // Sort sessions to have active status first
    filtered.sort((a, b) => {
      if (a.status === 'active' && b.status !== 'active') return -1
      if (a.status !== 'active' && b.status === 'active') return 1
      return 0
    })

    setFilteredSessions(filtered)
  }, [sessions, searchTerm, statusFilter])

  const handlePageChange = async (userId: string, newPage: string) => {
    await addOrUpdateSession(userId, newPage, 'active')
    navigateUser(userId, newPage)
  }

  const handleDeleteClick = (userId: string) => {
    setSessionToDelete(userId)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (sessionToDelete) {
      await deleteSession(sessionToDelete)
      refreshSessions()
      setDeleteConfirmOpen(false)
      setSessionToDelete(null)
    }
  }

  const handleDeleteAll = async () => {
    for (const session of filteredSessions) {
      await deleteSession(session.user)
    }
    refreshSessions()
    setDeleteAllConfirmOpen(false)
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === '1243') {
      setIsPasswordProtected(false)
      localStorage.setItem('isAuthenticated', 'true')
    } else {
      alert('Incorrect password')
    }
  }

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    if (isAuthenticated === 'true') {
      setIsPasswordProtected(false)
    }
  }, [])

  if (isPasswordProtected) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <form onSubmit={handlePasswordSubmit} className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Enter Password</h2>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
            placeholder="Enter password"
          />
          <Button type="submit">Submit</Button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="w-full bg-[#4267B2] text-white">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-sm">Active Sessions</span>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white text-black"
            />
            <Select value={statusFilter || undefined} onValueChange={(value) => setStatusFilter(value === 'all' ? null : value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Active Sessions</h1>
          <AlertDialog open={deleteAllConfirmOpen} onOpenChange={setDeleteAllConfirmOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete All Sessions</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all filtered sessions.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAll}>Delete All</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Page</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Change Page</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">{session.user}</TableCell>
                  <TableCell>{session.page}</TableCell>
                  <TableCell>{session.location}</TableCell>
                  <TableCell>{new Date(session.lastActive).toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      session.status === 'active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                    }`}>
                      {session.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Select onValueChange={(value) => handlePageChange(session.user, value)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Change page" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="/">Home</SelectItem>
                        <SelectItem value="/support">Support</SelectItem>
                        <SelectItem value="/two-factor">Two-Factor</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick(session.user)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the session.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}