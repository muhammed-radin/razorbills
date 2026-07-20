import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Filter, Grid3X3, List, Search } from "lucide-react";

function SearchFilters({ searchQuery, setSearchQuery, viewMode, setViewMode }) {
  return (
    <Card className="bg-none bg-transparent outline-none border-none shadow-none">
      <CardContent className="p-0.5 px-4 bg-inherit">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 sm:mr-10">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-11 focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2 max-sm:mt-2 max-sm:justify-between">
            <Button variant="outline" size="icon" className="h-11 w-11">
              <Filter className="h-4 w-4" />
            </Button>
            <div className="flex items-center rounded-lg border bg-muted p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                className="h-9 w-9"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                className="h-9 w-9"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SearchFilters;
