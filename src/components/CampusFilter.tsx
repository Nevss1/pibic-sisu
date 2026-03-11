"use client";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useCampusFilter } from "../app/(pages)/CampusFilterContext";
import { toTitleCase } from "../utils";

export function CampusFilter() {
  const { campusDisponiveis, campusSelecionado, setCampusSelecionado } = useCampusFilter();

  const handleChange = (event: SelectChangeEvent) => {
    setCampusSelecionado(event.target.value);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 260 }}>
      <InputLabel>Campus</InputLabel>
      <Select value={campusSelecionado} onChange={handleChange} label="Campus">
        {campusDisponiveis.map((campus) => (
          <MenuItem key={campus} value={campus}>
            {toTitleCase(campus)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
