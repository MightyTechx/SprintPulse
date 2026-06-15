import { useState, useMemo } from 'react';
import { Box, DataTable, Typography, Grid, TextField, PageHeader } from '@sprintpulse/component';
import { InputAdornment, Autocomplete } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DescriptionIcon from '@mui/icons-material/Description';
import { useStyles } from './styles';
import {
  FOLDERS,
  DOC_TYPES_LIST,
  DOCUMENTS,
  FOLDER_SX,
  TYPE_SX,
  columns,
} from './utils/technicalDocuments.utils';
import { useAdminKeyframes } from '@sprintpulse/hooks';

const TechnicalDocuments = () => {
  const { classes } = useStyles();
  const keyframes = useAdminKeyframes();

  const [folderFilter, setFolderFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      DOCUMENTS.filter((row) => {
        const matchFolder = !folderFilter || row.folder === folderFilter;
        const matchType = !typeFilter || row.type === typeFilter;
        const q = search.toLowerCase();
        const matchSearch =
          !q ||
          row.fileName.toLowerCase().includes(q) ||
          row.folder.toLowerCase().includes(q) ||
          row.type.toLowerCase().includes(q);
        return matchFolder && matchType && matchSearch;
      }),
    [folderFilter, typeFilter, search],
  );

  return (
    <>
      {keyframes}
      <Grid className={classes.container}>
        {/* ── Page Header ── */}
        <PageHeader
          title='Technical Documents'
          description='Access and manage technical documentation, manuals, and specifications.'
          icon={DescriptionIcon}
          variant='admin'
        />

        {/* ── Documents Table ── */}
        <Box className={classes.tableSection}>
          <Box className={classes.tableSectionHeader}>
            <Autocomplete
              sx={FOLDER_SX}
              options={FOLDERS}
              value={folderFilter || null}
              onChange={(_, v) => setFolderFilter(v ?? '')}
              renderInput={(params) => (
                <TextField {...params} label='Folder' size='small' placeholder='Search folder…' />
              )}
            />

            <Autocomplete
              sx={TYPE_SX}
              options={DOC_TYPES_LIST}
              value={typeFilter || null}
              onChange={(_, v) => setTypeFilter(v ?? '')}
              renderInput={(params) => (
                <TextField {...params} label='File Type' size='small' placeholder='Search type…' />
              )}
            />

            <TextField
              placeholder='Search documents…'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={classes.searchField}
              size='small'
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position='end'>
                      <SearchIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>
          <Box className={classes.tableWrapper}>
            <DataTable
              columns={columns}
              data={filtered}
              rowKey='id'
              searchable={false}
              initialRowsPerPage={10}
              elevation={0}
            />
          </Box>
        </Box>
      </Grid>
    </>
  );
};

export default TechnicalDocuments;
