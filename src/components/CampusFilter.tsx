"use client";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { toTitleCase } from "../utils";
import { useCampusFilter } from "../features";

type CampusFilterProps = {
  contained?: boolean;
};

export function CampusFilter({ contained = false }: CampusFilterProps) {
  const { campusDisponiveis, campusSelecionado, setCampusSelecionado } = useCampusFilter();

  const handleChange = (event: SelectChangeEvent) => {
    setCampusSelecionado(event.target.value);
  };

  return (
    <FormControl
      size="small"
      sx={{
        width: contained ? "100%" : { xs: "100%", mobile: "auto" },
        minWidth: contained ? 0 : { mobile: 220 },
        "& .MuiInputLabel-root": contained
          ? {
              color: "#7A6A58",
              fontWeight: 600,
              "&.Mui-focused": { color: "#9A6A21" },
            }
          : undefined,
        "& .MuiOutlinedInput-root": contained
          ? {
              height: 34,
              bgcolor: "rgba(255, 252, 248, 0.76)",
              borderRadius: "12px",
              color: "#3F3428",
              "& fieldset": {
                borderColor: "rgba(174, 143, 88, 0.18)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(174, 143, 88, 0.32)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#D5A642",
                borderWidth: 1,
              },
            }
          : undefined,
      }}
    >
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
