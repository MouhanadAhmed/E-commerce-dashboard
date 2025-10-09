import { useEffect, useMemo, useState } from 'react';
import {
  useActiveGroupsLoading,
  useArchivedGroupsLoading,
  useQueryResponseData,
} from '../core/QueryResponseProvider';
import { GroupOfOptions } from '../core/_models';
import {
  type MRT_TableOptions,
  type MRT_ColumnDef,
  type MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  TextField,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  deleteGroup,
  deleteSelectedGroups,
  updateGroup,
  createOption,
  updateOption,
  deleteOption,
} from '../core/_requests';
import { useMutation, useQueryClient } from 'react-query';
import { QUERIES } from '../../../../../../../../_metronic/helpers';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import * as Yup from 'yup';
import { Modal } from 'react-bootstrap';
import { useListView } from '../core/ListViewProvider';

const GroupTable = () => {
  const { selected, clearSelected } = useListView();
  const queryClient = useQueryClient();
  const { setItemIdForUpdate } = useListView();
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});
  const [optionValidationErrors, setOptionValidationErrors] = useState<
    Record<string, string | undefined>
  >({});
  const { active, archived } = useQueryResponseData();
  const [trigger, setTrigger] = useState(false);
  const [activeGroup, setActiveGroup] = useState<GroupOfOptions[]>(active);
  const [archivedGroup, setArchivedGroup] = useState<GroupOfOptions[]>(
    () => archived
  );
  const [draggingRow, setDraggingRow] =
    useState<MRT_Row<GroupOfOptions> | null>(null);
  const [hoveredTable, setHoveredTable] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [groupDelete, setGroupDelete] = useState();
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupOfOptions | null>(
    null
  );
  const [isEditingOptions, setIsEditingOptions] = useState(false);
  const [groupOptions, setGroupOptions] = useState<any[]>([]);
  const [draggingOption, setDraggingOption] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const isActiveLoading = useActiveGroupsLoading();
  const isArchivedLoading = useArchivedGroupsLoading();

  const columns = useMemo<MRT_ColumnDef<GroupOfOptions>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.name,
          helperText: validationErrors?.name,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              name: undefined,
            }),
        },
      },
      {
        accessorKey: 'min',
        header: 'Minimum',
        muiEditTextFieldProps: {
          type: 'number',
          required: true,
          error: !!validationErrors?.min,
          helperText: validationErrors?.min,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              min: undefined,
            }),
        },
      },
      {
        accessorKey: 'order',
        header: 'Order',
        muiEditTextFieldProps: {
          type: 'number',
          required: true,
          error: !!validationErrors?.order,
          helperText: validationErrors?.order,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              order: undefined,
            }),
        },
      },
      {
        accessorKey: 'available',
        header: 'Available',
        Cell: ({ cell }) => (cell.getValue() ? 'Yes' : 'No'),
        editVariant: 'select',
        muiEditTextFieldProps: {
          select: true,
          error: !!validationErrors?.available,
          helperText: validationErrors?.available,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              available: undefined,
            }),
        },
        // Define the select options
        editSelectOptions: [
          { value: true, label: 'Yes' },
          { value: false, label: 'No' },
        ],
      },
    ],
    [validationErrors]
  );

  const editGroupSchema = Yup.object().shape({
    name: Yup.string().min(1, 'Minimum 1 symbol').required('Name is required'),
    min: Yup.number()
      .min(0, 'Minimum value is 0')
      .required('Minimum is required'),
    stock: Yup.number()
      .nullable()
      .min(0, 'Stock cannot be negative')
      .optional(),
    sold: Yup.number()
      .min(0, 'Sold cannot be negative')
      .required('Sold is required'),
    order: Yup.number()
      .min(0, 'Order cannot be negative')
      .required('Order is required'),
    available: Yup.boolean().required('Availability is required'),
  });

  const editOptionSchema = Yup.object().shape({
    name: Yup.string().min(1, 'Minimum 1 symbol').required('Name is required'),
    price: Yup.number()
      .min(0, 'Price cannot be negative')
      .required('Price is required'),
    available: Yup.boolean().required('Availability is required'),
  });

  // Show snackbar notification
  const showNotification = (
    message: string,
    severity: 'success' | 'error' = 'success'
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  // Handle expand button click
  const handleExpandClick = (group: GroupOfOptions) => {
    setSelectedGroup(group);
    setGroupOptions(group.options || []);
    setShowOptionsModal(true);
    setIsEditingOptions(false);
    setOptionValidationErrors({});
  };

  // Handle close options modal
  const handleCloseOptionsModal = () => {
    setShowOptionsModal(false);
    setSelectedGroup(null);
    setIsEditingOptions(false);
    setGroupOptions([]);
    setOptionValidationErrors({});
  };

  // Handle manage options button click
  const handleManageOptions = () => {
    setIsEditingOptions(true);
  };

  // Validate all options
  const validateAllOptions = async (): Promise<boolean> => {
    const errors: Record<string, string> = {};

    for (const option of groupOptions) {
      try {
        await editOptionSchema.validate(option, { abortEarly: false });
      } catch (err: any) {
        err.inner.forEach((error: any) => {
          errors[`${option.id}_${error.path}`] = error.message;
        });
      }
    }

    setOptionValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle save options
  const handleSaveOptions = async () => {
    const isValid = await validateAllOptions();
    if (!isValid) {
      showNotification(
        'Please fix all validation errors before saving',
        'error'
      );
      return;
    }

    try {

      // First, process all options and find the default option
      const savePromises = groupOptions.map(async (option) => {
        const optionData = {
          name: option.name,
          price: option.price,
          order: option.order,
          available: option.available,
          groupOfOptions: { groupOfOptions: selectedGroup?._id },
          // isDefault: option.isDefault,
          // Note: We don't send isDefault to the option creation/update
        };

        if (option.isNew) {
          // Create new option
          const result = await createOptionMutation.mutateAsync(optionData);

          return result;
        } else {
          // Update existing option
          const result = await updateOptionMutation.mutateAsync({
            optionId: option._id || option.id,
            option: optionData,
          });

          return result;
        }
      });

      await Promise.all(savePromises);

      setIsEditingOptions(false);
      showNotification('Options saved successfully');

      // Refresh the groups data
      queryClient.invalidateQueries([`${QUERIES.GROUPS_LIST}`]);
    } catch (error) {
      console.error('Error saving options:', error);
      showNotification('Error saving options', 'error');
    }
  };

  // Handle cancel editing
  const handleCancelEditing = () => {
    setIsEditingOptions(false);
    // Reset to original group options
    setGroupOptions(selectedGroup?.options || []);
    setOptionValidationErrors({});
  };

  // Handle option field change
  const handleOptionChange = (optionId: string, field: string, value: any) => {
    setGroupOptions((prev) =>
      prev.map((option) => {
        if (option.id === optionId || option._id === optionId) {
          const updatedOption = { ...option, [field]: value };

          // Clear validation errors for this field
          if (optionValidationErrors[`${optionId}_${field}`]) {
            setOptionValidationErrors((prevErrors) => {
              const newErrors = { ...prevErrors };
              delete newErrors[`${optionId}_${field}`];
              return newErrors;
            });
          }

          return updatedOption;
        }
        return option;
      })
    );
  };

  // Handle available toggle change (replaced status)
  const handleAvailableChange = (optionId: string) => {
    setGroupOptions((prev) =>
      prev.map((option) => {
        if (option.id === optionId || option._id === optionId) {
          return {
            ...option,
            available: !option.available,
          };
        }
        return option;
      })
    );
  };

  // Handle add new option
  const handleAddNewOption = () => {
    const newOption = {
      id: `opt${Date.now()}`,
      name: 'New Option',
      price: 0,
      order: groupOptions.length + 1,
      available: true,
      isDefault: groupOptions.length === 0, // Mark as default if it's the first option
      isNew: true,
    };
    setGroupOptions((prev) => [...prev, newOption]);
  };

  // Handle default toggle change - updated to ensure only one default
  const handleDefaultChange = (optionId: string) => {
    setGroupOptions((prev) =>
      prev.map((option) => ({
        ...option,
        isDefault: option.id === optionId || option._id === optionId,
      }))
    );
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, optionId: string) => {
    setDraggingOption(optionId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetOptionId: string) => {
    e.preventDefault();
    if (!draggingOption || draggingOption === targetOptionId) return;

    const draggedIndex = groupOptions.findIndex(
      (opt) => opt.id === draggingOption || opt._id === draggingOption
    );
    const targetIndex = groupOptions.findIndex(
      (opt) => opt.id === targetOptionId || opt._id === targetOptionId
    );

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newOptions = [...groupOptions];
    const [draggedItem] = newOptions.splice(draggedIndex, 1);
    newOptions.splice(targetIndex, 0, draggedItem);

    // Update order numbers based on new positions
    const updatedOptions = newOptions.map((option, index) => ({
      ...option,
      order: index + 1,
    }));

    setGroupOptions(updatedOptions);
    setDraggingOption(null);
  };

  // UPDATE group
  const handleSaveGroup = async (originalRow: any) => {
    try {
      await editGroupSchema.validate(originalRow.row.original);
      setValidationErrors({});
      await updateGroupAvailable.mutateAsync({
        id: originalRow.row.original._id,
        update: originalRow.values,
      });
      table1.setEditingRow(null);
    } catch (err: any) {
      setValidationErrors({ [err.path]: err.message });
    }
  };

  // DELETE action
  const handleDeleteClick = () => {
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    await deleteItem.mutateAsync();
    setShowModal(false);
  };

  const openAddCategoryModal = () => {
    setItemIdForUpdate(null);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const deleteItem = useMutation(() => deleteGroup(groupDelete as string), {
    onSuccess: () => {
      queryClient.invalidateQueries([`${QUERIES.GROUPS_LIST}`]);
      setTrigger(true);
      showNotification('Group deleted successfully');
    },
    onError: () => {
      showNotification('Error deleting group', 'error');
    },
  });

  const deleteSelectedItems = useMutation(
    (ids: string[]) => deleteSelectedGroups(ids),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([`${QUERIES.GROUPS_LIST}`]);
        setTrigger(true);
        clearSelected();
        showNotification('Selected groups deleted successfully');
      },
      onError: () => {
        showNotification('Error deleting selected groups', 'error');
      },
    }
  );

  const updateGroupAvailable = useMutation(
    ({ id, update }: any) => updateGroup(id, update),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([`${QUERIES.GROUPS_LIST}`]);
        showNotification('Group updated successfully');
      },
      onError: () => {
        showNotification('Error updating group', 'error');
      },
    }
  );

  // Option mutations
  const createOptionMutation = useMutation(
    (option: any) => createOption(option),
    {
      onError: () => {
        showNotification('Error creating option', 'error');
      },
    }
  );

  const updateOptionMutation = useMutation(
    ({ optionId, option }: { optionId: string; option: any }) =>
      updateOption(optionId, option),
    {
      onError: () => {
        showNotification('Error updating option', 'error');
      },
    }
  );

  const deleteOptionMutation = useMutation(
    (optionId: string) => deleteOption(optionId),
    {
      onSuccess: () => {
        showNotification('Option deleted successfully');
      },
      onError: () => {
        showNotification('Error deleting option', 'error');
      },
    }
  );

  // Handle delete option
  const handleDeleteOption = async (optionId: string) => {
    const option = groupOptions.find(
      (opt) => opt.id === optionId || opt._id === optionId
    );

    if (option && !option.isNew) {
      // Existing option - delete from backend
      try {
        await deleteOptionMutation.mutateAsync(option._id || option.id);
        setGroupOptions((prev) =>
          prev.filter((opt) => opt.id !== optionId && opt._id !== optionId)
        );
      } catch (error) {
        console.error('Error deleting option:', error);
      }
    } else {
      // New option - just remove from local state
      setGroupOptions((prev) =>
        prev.filter((opt) => opt.id !== optionId && opt._id !== optionId)
      );
    }
  };

  const commonTableProps: Partial<MRT_TableOptions<GroupOfOptions>> & {
    columns: MRT_ColumnDef<GroupOfOptions>[];
  } = {
    columns,
    enableRowDragging: true,
    enableFullScreenToggle: false,
    muiTableContainerProps: {
      sx: {
        minHeight: '320px',
      },
    },
    onDraggingRowChange: setDraggingRow,
    state: { draggingRow },
  };

  useEffect(() => {
    setActiveGroup(active);
    setArchivedGroup(archived);
  }, [active, archived, trigger]);

  const table1 = useMaterialReactTable({
    ...commonTableProps,
    enableRowSelection: true,
    enableStickyHeader: true,
    enableCellActions: true,
    enableClickToCopy: 'context-menu',
    enableEditing: true,
    editDisplayMode: 'row',
    createDisplayMode: 'row',
    rowPinningDisplayMode: 'select-sticky',
    positionToolbarAlertBanner: 'bottom',
    positionActionsColumn: 'last',

    state: {
      columnOrder: [
        'mrt-row-select',
        'mrt-row-drag',
        'name',
        'min',
        'order',
        'available',
      ],
      isLoading: isActiveLoading,
    },

    renderTopToolbarCustomActions: ({ table }) => (
      <>
        <div className="card-header ribbon ribbon-start">
          <div className="ribbon-label ribbon ribbon-start bg-success">
            Active
          </div>
        </div>
        <Box
          sx={{
            display: 'flex',
            gap: '1rem',
            p: '4px',
            justifyContent: 'right',
          }}
        >
          <Button
            color="info"
            onClick={openAddCategoryModal}
            variant="contained"
          >
            Add Group
          </Button>
          <Button
            color="secondary"
            disabled={!table.getIsSomeRowsSelected()}
            onClick={async () => {
              table.getSelectedRowModel().rows.map(async (item) => {
                await updateGroupAvailable.mutateAsync({
                  id: item.original._id,
                  update: { deleted: false },
                });
              });
              table.toggleAllRowsSelected(false);
            }}
            variant="contained"
          >
            Toggle Available
          </Button>
          <Button
            color="error"
            disabled={!table.getIsSomeRowsSelected()}
            onClick={async () => {
              let selectedIDs: string[] = [];
              table.getSelectedRowModel().rows.forEach((item) => {
                if (item.original._id) {
                  selectedIDs.push(item.original._id);
                }
              });
              await deleteSelectedItems.mutateAsync(selectedIDs);
            }}
            variant="contained"
          >
            Delete Selected
          </Button>
        </Box>
      </>
    ),
    data: activeGroup,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: (originalRow) => handleSaveGroup(originalRow),
    getRowId: (originalRow) => `table-1-${originalRow._id || originalRow.name}`,
    muiRowDragHandleProps: {
      onDragEnd: async () => {
        if (hoveredTable === 'table-2' && draggingRow) {
          await updateGroupAvailable.mutateAsync({
            id: draggingRow.original._id,
            update: { deleted: true },
          } as any);
          setArchivedGroup((archivedGroup) => [
            ...archivedGroup,
            draggingRow.original,
          ]);
          setActiveGroup((activeGroup) =>
            activeGroup.filter((d) => d._id !== draggingRow.original._id)
          );
        }
        setHoveredTable(null);
      },
    },
    muiTablePaperProps: {
      onDragEnter: () => setHoveredTable('table-1'),
      sx: {
        outline: hoveredTable === 'table-1' ? '2px dashed green' : undefined,
      },
    },
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '0.5rem' }}>
        <Tooltip title="View Options">
          <IconButton
            color="primary"
            onClick={() => handleExpandClick(row.original)}
            size="small"
          >
            <ExpandMoreIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)} size="small">
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            color="error"
            onClick={() => {
              setGroupDelete(row.original._id as any);
              handleDeleteClick();
            }}
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  });

  const table2 = useMaterialReactTable({
    ...commonTableProps,
    data: archivedGroup,
    enableRowSelection: true,
    enableStickyHeader: true,
    enableCellActions: true,
    enableClickToCopy: 'context-menu',
    enableEditing: true,
    editDisplayMode: 'row',
    createDisplayMode: 'row',
    rowPinningDisplayMode: 'select-sticky',
    positionToolbarAlertBanner: 'bottom',
    positionActionsColumn: 'last',

    state: {
      columnOrder: [
        'mrt-row-select',
        'mrt-row-drag',
        'name',
        'min',
        'order',
        'available',
      ],
      isLoading: isArchivedLoading,
    },
    getRowId: (originalRow) => `table-2-${originalRow._id || originalRow.name}`,
    muiRowDragHandleProps: {
      onDragEnd: async () => {
        if (hoveredTable === 'table-1' && draggingRow) {
          await updateGroupAvailable.mutateAsync({
            id: draggingRow.original._id,
            update: { deleted: false },
          } as any);
          setActiveGroup((activeGroup) => [
            ...activeGroup,
            draggingRow.original,
          ]);
          setArchivedGroup((archivedGroup) =>
            archivedGroup.filter((d) => d._id !== draggingRow.original._id)
          );
        }
        setHoveredTable(null);
      },
    },
    muiTablePaperProps: {
      onDragEnter: () => setHoveredTable('table-2'),
      sx: {
        outline: hoveredTable === 'table-2' ? '2px dashed pink' : undefined,
      },
    },
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '0.5rem' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)} size="small">
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Restore">
          <IconButton
            color="error"
            onClick={async () => {
              await updateGroupAvailable.mutateAsync({
                id: row.original._id,
                update: { deleted: false },
              });
            }}
            size="small"
          >
            <RestoreFromTrashIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <>
        <div className="card-header ribbon ribbon-start">
          <div className="ribbon-label ribbon ribbon-start bg-danger">
            Archive
          </div>
        </div>
        <Box
          sx={{
            display: 'flex',
            gap: '1rem',
            p: '4px',
            justifyContent: 'right',
          }}
        >
          <Button
            color="error"
            disabled={!table.getIsSomeRowsSelected()}
            onClick={async () => {
              table.getSelectedRowModel().rows.map(async (item) => {
                await updateGroupAvailable.mutateAsync({
                  id: item.original._id,
                  update: { deleted: false },
                });
              });
              table.toggleAllRowsSelected(false);
            }}
            variant="contained"
          >
            Restore Selected
          </Button>
        </Box>
      </>
    ),
  });

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gap: '1rem',
          overflow: 'auto',
          p: '4px',
        }}
      >
        <MaterialReactTable table={table1} />
      </Box>
      <Box
        sx={{
          display: 'grid',
          gap: '1rem',
          overflow: 'auto',
          p: '4px',
        }}
      >
        <MaterialReactTable table={table2} />
      </Box>

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
        <Modal.Footer>
          <Box sx={{ display: 'flex', gap: '1rem', p: '4px' }}>
            <Button color="info" variant="contained" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </Box>
        </Modal.Footer>
      </Modal>

      {/* Options Modal */}
      <Modal show={showOptionsModal} onHide={handleCloseOptionsModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditingOptions ? 'Manage Options' : 'View Options'} -{' '}
            {selectedGroup?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!isEditingOptions && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Group Information
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 2,
                  mb: 3,
                }}
              >
                <div>
                  <Typography variant="body2" color="textSecondary">
                    Group Name:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {selectedGroup?.name}
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" color="textSecondary">
                    Minimum Options:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {selectedGroup?.min}
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" color="textSecondary">
                    Order:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {selectedGroup?.order}
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" color="textSecondary">
                    Available:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {selectedGroup?.available ? 'Yes' : 'No'}
                  </Typography>
                </div>
              </Box>
            </Box>
          )}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Available Options ({groupOptions.length})
            </Typography>
            {isEditingOptions && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Drag and drop to reorder options. Only one option can be set as
                default.
              </Alert>
            )}
          </Box>

          <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  {isEditingOptions && <th style={{ width: '30px' }}></th>}
                  <th>Order</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Available</th>
                  <th>Default</th>
                  {isEditingOptions && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {groupOptions
                  .sort((a, b) => a.order - b.order)
                  .map((option) => (
                    <tr
                      key={option.id || option._id}
                      draggable={isEditingOptions}
                      onDragStart={(e) =>
                        handleDragStart(e, option.id || option._id)
                      }
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, option.id || option._id)}
                      style={{
                        cursor: isEditingOptions ? 'move' : 'default',
                        backgroundColor:
                          draggingOption === (option.id || option._id)
                            ? '#f0f0f0'
                            : 'inherit',
                      }}
                    >
                      {isEditingOptions && (
                        <td>
                          <DragIndicatorIcon
                            sx={{ color: 'text.secondary', cursor: 'grab' }}
                          />
                        </td>
                      )}
                      <td>
                        {isEditingOptions ? (
                          <TextField
                            size="small"
                            type="number"
                            value={option.order}
                            onChange={(e) =>
                              handleOptionChange(
                                option.id || option._id,
                                'order',
                                parseInt(e.target.value)
                              )
                            }
                            sx={{ width: '80px' }}
                            inputProps={{ min: 1 }}
                          />
                        ) : (
                          <Typography variant="body2">
                            {option.order}
                          </Typography>
                        )}
                      </td>
                      <td>
                        {isEditingOptions ? (
                          <Box>
                            <TextField
                              size="small"
                              value={option.name}
                              onChange={(e) =>
                                handleOptionChange(
                                  option.id || option._id,
                                  'name',
                                  e.target.value
                                )
                              }
                              sx={{ minWidth: '120px' }}
                              error={
                                !!optionValidationErrors[
                                  `${option.id || option._id}_name`
                                ]
                              }
                              helperText={
                                optionValidationErrors[
                                  `${option.id || option._id}_name`
                                ]
                              }
                            />
                          </Box>
                        ) : (
                          <Typography variant="body1" fontWeight="medium">
                            {option.name}
                          </Typography>
                        )}
                      </td>
                      <td>
                        {isEditingOptions ? (
                          <Box>
                            <TextField
                              size="small"
                              type="number"
                              value={option.price}
                              onChange={(e) =>
                                handleOptionChange(
                                  option.id || option._id,
                                  'price',
                                  parseFloat(e.target.value)
                                )
                              }
                              sx={{ width: '100px' }}
                              inputProps={{ min: 0, step: 0.01 }}
                              InputProps={{
                                startAdornment: (
                                  <Typography sx={{ mr: 1 }}>$</Typography>
                                ),
                              }}
                              error={
                                !!optionValidationErrors[
                                  `${option.id || option._id}_price`
                                ]
                              }
                              helperText={
                                optionValidationErrors[
                                  `${option.id || option._id}_price`
                                ]
                              }
                            />
                          </Box>
                        ) : (
                          <Typography
                            variant="body1"
                            color={
                              option.price > 0
                                ? 'success.main'
                                : 'text.secondary'
                            }
                          >
                            {option.price > 0 ? `+$${option.price}` : 'Free'}
                          </Typography>
                        )}
                      </td>
                      <td>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={option.available}
                              onChange={() =>
                                handleAvailableChange(option.id || option._id)
                              }
                              disabled={!isEditingOptions}
                              color="success"
                            />
                          }
                          label={option.available ? 'Yes' : 'No'}
                        />
                      </td>
                      <td>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={option.isDefault}
                              onChange={() =>
                                handleDefaultChange(option.id || option._id)
                              }
                              disabled={!isEditingOptions}
                              color="primary"
                            />
                          }
                          label={option.isDefault ? 'Default' : ''}
                        />
                      </td>
                      {isEditingOptions && (
                        <td>
                          <Tooltip title="Delete Option">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() =>
                                handleDeleteOption(option.id || option._id)
                              }
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          </Box>

          {isEditingOptions && (
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                onClick={handleAddNewOption}
              >
                Add New Option
              </Button>
            </Box>
          )}

          {groupOptions.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="textSecondary">
                No options available for this group.
              </Typography>
            </Box>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Box
            sx={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}
          >
            {isEditingOptions ? (
              <>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<CancelIcon />}
                  onClick={handleCancelEditing}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveOptions}
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                <Button variant="outlined" onClick={handleCloseOptionsModal}>
                  Close
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleManageOptions}
                >
                  Manage Options
                </Button>
              </>
            )}
          </Box>
        </Modal.Footer>
      </Modal>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </>
  );
};

export { GroupTable };
