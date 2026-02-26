import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link/Link';
import Modal from '@mui/material/Modal';
import api from 'api';
import useMyApi from 'components/hooks/useMyApi';
import useMySnackbar from 'components/hooks/useMySnackbar';
import type { Case } from 'models/entities/generated/Case';
import type { Hit } from 'models/entities/generated/Hit';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CaseCreationForm from './CaseCreationForm';

const CaseCreationModal = ({ hit }: { hit: Hit }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { dispatchApi } = useMyApi();
  const { showSuccessMessage } = useMySnackbar();
  const navigate = useNavigate();
  const { t } = useTranslation();

    const createCase = useCallback(
      async (newCase: Partial<Case>) => {
        if (!newCase?.title || !newCase?.summary) {
          return;
        }

        try {
          await dispatchApi(api.v2.case.post(newCase)).then(async (createdCase) => {
            showSuccessMessage(`Case \`${createdCase.title}\` created successfully!`, 5000, {
                    action: () => (
                      <Link sx={{ color: 'secondary.light', cursor: 'pointer', mr: 1 }} onClick={() => navigate(`/cases/${createdCase.case_id}`)}>
                       {t('route.cases.view')}
                      </Link>
                    )
                  });
          });
        } finally {
          return;
        }
      },
      [dispatchApi]
    );

  return (<>
  <Button variant="outlined" onClick={handleOpen} sx={{ height: 40, }}>{t('route.cases.create')}</Button>
  <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
        sx={{
          mt: 10,
          mx: 'auto',
          maxWidth: '600px',
          maxHeight: '600px',
        }}
  >
    <Box>
      <CaseCreationForm targetHit={hit} onCreate={async (newCase) => {
        await createCase(newCase);
        handleClose();
      }} >
      </CaseCreationForm>
    </Box>
  </Modal></>);
};

export default CaseCreationModal;
