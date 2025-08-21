import { useState } from "react";
import { Search, Filter, X, Calendar, User, FolderOpen, FileType } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface DocumentFilters {
  search: string;
  category: string;
  type: string;
  dateFrom: string;
  dateTo: string;
  uploadedBy: string;
  status: string;
}

interface DocumentFiltersProps {
  filters: DocumentFilters;
  onFiltersChange: (filters: DocumentFilters) => void;
  onClearFilters: () => void;
}

const categories = ["Guidelines", "Protocols", "Procedures", "References", "Reports"];
const types = ["PDF", "DOC", "DOCX", "XLS", "XLSX", "TXT"];
const uploaders = ["Dr. Martin", "Dr. Dubois", "Dr. Rodriguez", "Dr. Chen", "Current User"];
const statuses = ["active", "archived", "draft"];

export function DocumentFilters({ filters, onFiltersChange, onClearFilters }: DocumentFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const updateFilter = (key: keyof DocumentFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => value && value.trim() !== "").length;
  };

  const hasActiveFilters = getActiveFilterCount() > 0;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search documents by name, description, tags..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="pl-10 h-12"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn(
              "relative",
              hasActiveFilters && "border-primary"
            )}>
              <Filter className="mr-2 h-4 w-4" />
              Advanced Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-4" align="start">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Advanced Filters</h4>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onClearFilters();
                      setIsFilterOpen(false);
                    }}
                  >
                    <X className="mr-1 h-3 w-3" />
                    Clear All
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center text-xs">
                    <FolderOpen className="mr-1 h-3 w-3" />
                    Category
                  </Label>
                  <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center text-xs">
                    <FileType className="mr-1 h-3 w-3" />
                    File Type
                  </Label>
                  <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All types</SelectItem>
                      {types.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center text-xs">
                    <User className="mr-1 h-3 w-3" />
                    Uploaded By
                  </Label>
                  <Select value={filters.uploadedBy} onValueChange={(value) => updateFilter('uploadedBy', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All users" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All users</SelectItem>
                      {uploaders.map((uploader) => (
                        <SelectItem key={uploader} value={uploader}>
                          {uploader}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Status</Label>
                  <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All statuses</SelectItem>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center text-xs">
                  <Calendar className="mr-1 h-3 w-3" />
                  Date Range
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    placeholder="From date"
                    value={filters.dateFrom}
                    onChange={(e) => updateFilter('dateFrom', e.target.value)}
                  />
                  <Input
                    type="date"
                    placeholder="To date"
                    value={filters.dateTo}
                    onChange={(e) => updateFilter('dateTo', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground"
          >
            <X className="mr-1 h-3 w-3" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.category && (
            <Badge variant="secondary" className="gap-1">
              Category: {filters.category}
              <button onClick={() => updateFilter('category', '')} className="hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.type && (
            <Badge variant="secondary" className="gap-1">
              Type: {filters.type}
              <button onClick={() => updateFilter('type', '')} className="hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.uploadedBy && (
            <Badge variant="secondary" className="gap-1">
              By: {filters.uploadedBy}
              <button onClick={() => updateFilter('uploadedBy', '')} className="hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.status && (
            <Badge variant="secondary" className="gap-1">
              Status: {filters.status}
              <button onClick={() => updateFilter('status', '')} className="hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {(filters.dateFrom || filters.dateTo) && (
            <Badge variant="secondary" className="gap-1">
              Date: {filters.dateFrom || '...'} to {filters.dateTo || '...'}
              <button onClick={() => {
                updateFilter('dateFrom', '');
                updateFilter('dateTo', '');
              }} className="hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}