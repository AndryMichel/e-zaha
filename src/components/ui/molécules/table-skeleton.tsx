"use client"

// components/ui/molecules/table-skeleton.tsx
import React from 'react';
import {Table, TableBody, TableCell, TableRow,} from '@/components/ui/organismes/table';
import {Skeleton} from '@/components/ui/atomes/skeleton';

export interface TableSkeletonProps {
    columns?: number;
    rows?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
                                                                columns = 5,
                                                                rows = 5,
                                                            }) => {
    return (
        <div className="overflow-x-auto">
            <Table>
                <TableBody>
                    {[...Array(rows)].map((_, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {[...Array(columns)].map((_, colIndex) => (
                                <TableCell key={colIndex}>
                                    <Skeleton height={20} width="80%"/>
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default TableSkeleton;