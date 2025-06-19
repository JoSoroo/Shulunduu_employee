// components/shift/ShiftRoleSelector.tsx
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
export default function ShiftRoleSelector({
  role,
  employees,
  selected,
  onChange,
}) {
  const filteredEmployees = employees.filter((emp) => emp.role === role);
  console.log(`Filtering employees for role "${role}":`, filteredEmployees);
  return (
    <div className="grid gap-3">
      <Label>{role}</Label>
      <Select value={selected} onValueChange={(value) => onChange(role, value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Ажилтан сонгох" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{role}</SelectLabel>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.name}
                </SelectItem>
              ))
            ) : (
              <div className="px-2 py-1 text-sm text-muted-foreground">
                Ажилтан олдсонгүй
              </div>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
