# Excel Import

The Excel import module supports preview-first imports.

## Flow

1. User selects module.
2. User uploads Excel.
3. API parses first sheet.
4. Rows are normalized.
5. Validation errors are shown.
6. User confirms import.
7. API writes valid rows and keeps invalid rows in the import batch.

## Current preview endpoint

```text
POST /api/imports/excel/preview
```

Form fields:

```text
module=service-requests
file=<xlsx file>
```

Supported modules:

- service-requests
- inventory
- incidents
- access-management
- compliance
- vendors-licenses
- users-teams

## Recommended Excel templates

Service Requests:

```text
Title, Category, Priority, Description, Project, Requested By, Assigned To
```

Inventory:

```text
Asset Tag, Type, Make, Model, Serial Number, Status, Location, Warranty End
```
