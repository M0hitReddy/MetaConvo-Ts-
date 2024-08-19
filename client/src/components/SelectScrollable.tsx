import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EarthLock } from "lucide-react";

interface SelectScrollablePrope {
  data: Array<any>;
  onChange: (value: string) => void;
  value: string;
  setLanguage: (value: string) => void;
}

export function SelectScrollable({ data, onChange, value, setLanguage }: SelectScrollablePrope) {
  return (
    <Select onValueChange={setLanguage} value={value}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Languages</SelectLabel>
          {data.map((item) => (
            <SelectItem onSelect={(e:any) => console.log(e.target.value)} key={item.code} value={item.code}>
              {item.language}
            </SelectItem>
          ))}
          <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
          <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
          <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
          <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
          <SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>
          <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
