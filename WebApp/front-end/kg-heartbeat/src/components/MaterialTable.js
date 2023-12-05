import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { mkConfig, generateCsv, download } from 'export-to-csv'; 
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Box, Button } from '@mui/material';


const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});

const MaterialTable = ({columns_value, data_table}) => {
  //should be memoized or stable
  const columns = useMemo(
    () => columns_value,
    [columns_value],
  );
  const data = data_table;

    const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  const table = useMaterialReactTable({
    columns,
    data,

    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
            display: 'flex',
            gap: '16px',
          padding: '8px',
            flexWrap: 'wrap',
        }}
      >
        <Button
          //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
          onClick={handleExportData}
          startIcon={<FileDownloadIcon />}
        >
          Export All Data
        </Button>
      </Box>
    )
  });

  return <MaterialReactTable table={table}/>;
};

export default MaterialTable;
