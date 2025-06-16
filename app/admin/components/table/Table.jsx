import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
export default function TableItems({
  caption,
  headers,
  rows,
  onEdit,
  onDelete,
}) {
  return (
    <Table>
      {caption && <TableCaption>{caption}</TableCaption>}
      <TableHeader>
        <TableRow>
          {headers.map((header, index) => (
            <TableHead key={index}>{header}</TableHead>
          ))}
          <TableHead>Үйлдэл</TableHead> {/* нэмэлт багана */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((branch, rowIndex) => (
          <TableRow key={branch.id || rowIndex}>
            {branch.row.map((cell, cellIndex) => (
              <TableCell key={cellIndex}>
                {/* Хэрвээ cell нь массив байвал (ажилчидын мэдээлэл) */}
                {Array.isArray(cell) ? (
                  <div className="flex flex-col gap-2">
                    {cell.map((emp, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        {emp.image ? (
                          <img
                            src={emp.image}
                            alt={emp.role}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-300" />
                        )}
                        <div className="text-sm">
                          <div className="font-medium">{emp.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {emp.role}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Хэрвээ жирийн string эсвэл number бол шууд харуулна
                  cell
                )}
              </TableCell>
            ))}
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Үйлдэл</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => onEdit(rowIndex)}>
                    Засах
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onDelete(rowIndex)}>
                    Устгах
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
