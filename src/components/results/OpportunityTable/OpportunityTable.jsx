import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/pt-br';
import {
  IconButton,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Paper,
  Chip,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { MatchTierChip } from '../MatchTierChip/MatchTierChip';
import { TechTags } from '../TechTags/TechTags';
import { copyToClipboard } from '../../../utils/copyToClipboard';
import { useSnackbar } from 'notistack';

dayjs.extend(relativeTime);
dayjs.locale('pt-br');

export function OpportunityTable({ opportunities, pitchTemplate }) {
  const { enqueueSnackbar } = useSnackbar();

  const handleCopy = async (opp) => {
    const pitch = (pitchTemplate || '')
      .replace('[contexto]', opp.title)
      .replace('[titulo]', opp.title);

    const text = pitch ? `${pitch}\n\n${opp.url}` : opp.url;
    await copyToClipboard(text);
    enqueueSnackbar('Copiado!', { variant: 'success' });
  };

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Título</TableCell>
            <TableCell>Fonte</TableCell>
            <TableCell>Match</TableCell>
            <TableCell>Stack</TableCell>
            <TableCell>Publicado</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {opportunities.map((opp) => (
            <TableRow key={opp.id} hover>
              <TableCell sx={{ maxWidth: 320 }}>
                <Tooltip title={opp.description || opp.title}>
                  <Typography variant="body2" noWrap>
                    {opp.title}
                  </Typography>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Chip label={opp.sourceLabel} size="small" />
              </TableCell>
              <TableCell>
                <MatchTierChip tier={opp.tier} score={opp.matchScore} />
              </TableCell>
              <TableCell>
                <TechTags technologies={opp.technologies} />
              </TableCell>
              <TableCell>
                {opp.publishedAt ? dayjs(opp.publishedAt).fromNow() : '—'}
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                  <Tooltip title="Abrir original">
                    <IconButton
                      component={Link}
                      href={opp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                    >
                      <OpenInNewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Copiar link / pitch">
                    <IconButton size="small" onClick={() => handleCopy(opp)}>
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
