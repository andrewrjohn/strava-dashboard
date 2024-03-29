'use client'
import React from 'react'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { getActivities } from '@/app/actions'
import { formatTime, miles } from '@/lib/numbers'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import { Button } from './ui/button'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ChevronDown,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

function getPace(meters: number, seconds: number) {
  const pace = seconds / miles(meters)
  return formatTime(pace)
}

type Activities = Awaited<ReturnType<typeof getActivities>>

const colHelper = createColumnHelper<Activities[number]>()

interface Props {
  activities: Activities
}

export default function ActivityTable(props: Props) {
  const { activities } = props

  const columns = React.useMemo(
    () => [
      colHelper.accessor('distance', {
        header: 'Distance',
        cell: ({ getValue }) => <div>{miles(getValue()).toFixed(2)} mi</div>,
      }),
      colHelper.accessor('moving_time', {
        header: 'Time',
        cell: ({ getValue }) => <div>{formatTime(getValue())}</div>,
      }),
      colHelper.accessor('average_speed', {
        header: 'Pace',
        cell: ({ row: { original } }) => {
          return (
            <div>{getPace(original.distance, original.moving_time)} /mi</div>
          )
        },
      }),
      colHelper.accessor('start_date', {
        header: () => <div className="ml-auto">Date</div>,
        cell: ({ getValue }) => (
          <div className="text-right">
            {format(new Date(getValue()), 'MM/dd/yyyy h:mmaaa')}
          </div>
        ),
      }),
    ],
    [],
  )

  const table = useReactTable({
    data: activities,
    columns,
    initialState: {
      sorting: [{ id: 'start_date', desc: true }],
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const pageSize = table.getState().pagination.pageSize
  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? 'cursor-pointer select-none flex items-center gap-2'
                              : ''
                          }
                          onClick={header.column.getToggleSortingHandler()}
                          title={
                            header.column.getCanSort()
                              ? header.column.getNextSortingOrder() === 'asc'
                                ? 'Sort ascending'
                                : header.column.getNextSortingOrder() === 'desc'
                                  ? 'Sort descending'
                                  : 'Clear sort'
                              : undefined
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: <ArrowUp className="h-5 w-5" />,
                            desc: <ArrowDown className="h-5 w-5" />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => {
              return (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-[auto,1fr,auto] my-2">
        <div />
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-5 w-5" /> Previous
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="flex items-center gap-2"
          >
            Next <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={'outline'} className="flex items-center gap-2">
              Show: {pageSize === activities.length ? 'All' : pageSize}{' '}
              <ChevronDown className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem
              checked={pageSize === 10 && pageSize !== activities.length}
              onCheckedChange={() => table.setPageSize(() => 10)}
            >
              10
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={pageSize === 25 && pageSize !== activities.length}
              onCheckedChange={() => table.setPageSize(() => 25)}
            >
              25
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={pageSize === 50 && pageSize !== activities.length}
              onCheckedChange={() => table.setPageSize(() => 50)}
            >
              50
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={pageSize === activities.length}
              onCheckedChange={() => table.setPageSize(() => activities.length)}
            >
              All
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
