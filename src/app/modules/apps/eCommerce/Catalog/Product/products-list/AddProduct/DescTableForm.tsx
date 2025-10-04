import React, { useState, useRef } from "react";
import { MaterialReactTable } from "material-react-table";
import { Button, TextField, IconButton, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const DescTableForm = ({ items, setItems }) => {
  const descTableRef = useRef();
  const [numberOfItems, setNumberOfItems] = useState(items ? items.length : 0);

  const [descItems, setDescItems] = useState(items);

  const handleInputChange = (index, field, value) => {
    const newItems = descItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    setDescItems(newItems);
    setItems(newItems);
  };

  const handleDelete = (index) => {
    const newItems = descItems.filter((_, i) => i !== index);
    setDescItems(newItems);
    setItems(newItems);
  };

  const handleAddItems = () => {
    if (!descTableRef.current) return;
    const newItems = Array.from(
      { length: Number((descTableRef.current as any).value) },
      (_, index) => ({
        name: '',
        value: '',
        order: descItems.length + index + 1,
      })
    );
    setDescItems([...descItems, ...newItems]);
    setItems([...descItems, ...newItems]);
    setNumberOfItems(descItems.length + newItems.length);
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      size: 300,
      Cell: ({ cell, row, column }) => (
        <TextField
          value={cell.getValue() || ""}
          onChange={(e) =>
            handleInputChange(row.index, column.id, e.target.value)
          }
          fullWidth
        />
      ),
    },
    {
      accessorKey: "value",
      header: "Value",
      size: 100,
      Cell: ({ cell, row, column }) => (
        <TextField
          value={cell.getValue() || ""}
          onChange={(e) =>
            handleInputChange(row.index, column.id, e.target.value)
          }
          fullWidth
        />
      ),
    },
    {
      accessorKey: "order",
      header: "Order",
      size: 100,
      Cell: ({ cell, row, column }) => (
        <TextField
          value={cell.getValue() || ""}
          onChange={(e) =>
            handleInputChange(row.index, column.id, e.target.value)
          }
          fullWidth
        />
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      Cell: ({ row }) => (
        <IconButton onClick={() => handleDelete(row.index)}>
          <DeleteIcon color="error" />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <Box mb={2} display="flex" justifyContent="center" alignItems="center">
        <TextField
          placeholder="Enter the number of items"
          type="number"
          inputRef={descTableRef}
          variant="outlined"
          className=" mx-2"
        />
        <button
          type="button"
          className="btn btn-primary "
          onClick={handleAddItems}
        >
          Add
        </button>
      </Box>

      {numberOfItems !== 0 ? (
        <MaterialReactTable
          columns={columns}
          data={descItems}
          enableRowOrdering
          enableSorting
          muiTableContainerProps={{
            sx: {
              maxHeight: "500px",
            },
          }}
          muiTableBodyRowProps={({ row }) => ({
            sx: {
              cursor: "grab",
            },
          })}
          muiRowDragHandleProps={({ table }) => ({
            onDragEnd: () => {
              const { draggingRow, hoveredRow } = table.getState();
              if (hoveredRow && draggingRow) {
                const newDescItems = [...descItems];
                newDescItems.splice(
                  hoveredRow.index,
                  0,
                  newDescItems.splice(draggingRow.index, 1)[0],
                );
                // Update order based on new position
                const updatedItems = newDescItems.map((item, index) => ({
                  ...item,
                  order: index + 1,
                }));
                setDescItems(updatedItems);
                setItems(updatedItems);
              }
            },
          })}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default DescTableForm;
