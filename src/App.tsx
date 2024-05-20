import "./App.css";
import { Theme, presetGpnDefault } from "@consta/uikit/Theme";
import { Table, TableColumn, TableRow } from "@consta/uikit/Table";
import { useCountries } from "./countries";
import { useMemo } from "react";

export interface Country {
  a2: string;
  a3: string;
  active: boolean;
  countryId: string;
  idd: string;
  mvccVersion: string;
  name: string;
  nameCurrentValue: string;
  number: string;
  zipRequired: boolean;
}

function App() {
  const { data: countries } = useCountries();
  let rows = [
    {
      id: "",
      a2: "",
      a3: "",
      active: false,
      countryId: "",
      idd: "",
      mvccVersion: "",
      name: "",
      nameCurrentValue: "",
      number: "",
      zipRequired: false,
    },
  ];

  if (countries) {
    rows = [];
    for (let i = 0; countries.length > i; i++) {
      rows.push({ id: countries[i]?.countryId, ...countries[i] });
    }
  }

  console.log(rows);

  let columns: TableColumn<(typeof rows)[number]>[] = [
    {
      title: "id",
      accessor: "id",
      sortable: true,
    },
    {
      title: "a3",
      accessor: "a3",
      sortable: true,
    },
    {
      title: "idd",
      accessor: "idd",
      sortable: true,
    },
    {
      title: "name",
      accessor: "name",
      sortable: true,
    },
  ];

  console.log(columns);

  return (
    <Theme preset={presetGpnDefault}>
      <Table rows={rows} columns={columns} />
    </Theme>
  );
}

export default App;
