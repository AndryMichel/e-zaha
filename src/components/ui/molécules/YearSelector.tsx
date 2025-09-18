'use client'

import React from 'react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/molécules/select";

interface YearSelectorProps {
    selectedYear: number;
    availableYears: number[];
    onChange: (year: number) => void;
    className?: string;
}

export function YearSelector({selectedYear, availableYears, onChange, className = ""}: YearSelectorProps) {
    return (
        <div className={`w-48 ${className}`}>
            <Select
                value={selectedYear.toString()}
                onValueChange={(value) => onChange(parseInt(value))}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une année"/>
                </SelectTrigger>
                <SelectContent>
                    {availableYears.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                            {year}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}