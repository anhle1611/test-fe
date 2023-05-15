import React, { useContext, useState, useRef } from 'react'
import BTable from 'react-bootstrap/Table';
import { useTable, usePagination } from 'react-table';

import 'bootstrap/dist/css/bootstrap.min.css';

import { StoreContext } from "../../store.context";
import { list as listGuests, update, destroy } from "../../services/guest.service";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DataTable: React.FC = () => {

    const notify = (message: string) => toast(message);

    const { authStore } = useContext(StoreContext);
    const accessToken = authStore.getAccessToken();

    const columns = React.useMemo(
        () =>  [
            {
                Header: '#Id',
                accessor: 'id',
            },
            {
                Header: 'Name',
                accessor: 'name',
            },
            {
                Header: 'Description',
                accessor: 'description',
            },
            {
                Header: 'Created At',
                accessor: 'created_at',
            },
            {
                Header: 'Update At',
                accessor: 'updated_at',
            }
        ],
        []
    );

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [controlledPageCount, setConPageCount] = useState(0);
    const [total, setTotal] = useState(0);
    const [skipPageReset, setSkipPageReset] = React.useState(false)
    const fetchIdRef = useRef(0);
  
    const fetchData = React.useCallback(async ({ pageSize, pageIndex }) => {
        const fetchId = ++fetchIdRef.current
    
        setLoading(true)
    
        if (fetchId === fetchIdRef.current) {
        const offset = pageSize * pageIndex;
        const limit = pageSize;
        const { list, count } = await listGuests({ offset, limit}, accessToken);
        setTotal(count);
        setData(list);
        setConPageCount(Math.ceil(count/pageSize));
        setLoading(false);
        }
    }, [])

    const updateMyData = async (rowIndex: number, columnId: string, value: any ) => {
        setSkipPageReset(true);
        
        const dataUpdate = {
            [columnId]: value
        };

        const res = await update(data[rowIndex].id, { ...dataUpdate }, accessToken);
        if(res.status === 200) {
            setData(old =>
            old.map((row, index) => {
                if (index === rowIndex) {
                return {
                    ...old[rowIndex],
                    [columnId]: value,
                }
                }
                return row;
            })
            )
        }
        
        notify(res.data.message);
    }

    const EditableCell = ({
        value: initialValue,
        row: { index },
        column: { id },
        updateMyData, // This is a custom function that we supplied to our table instance
      }: any) => {
        const [value, setValue] = React.useState(initialValue)
      
        const onChange = (e: any) => {
          setValue(e.target.value)
        }
      
        const onBlur = () => {
          updateMyData(index, id, value)
        }
      
        React.useEffect(() => {
          setValue(initialValue)
        }, [initialValue])
      
        return <input style={{border: 0}} value={value} onChange={onChange} onBlur={onBlur} />
    }
    
    // Set our editable cell renderer as the default Cell renderer
    const defaultColumn = {
        Cell: EditableCell,
    }

    const {
        getTableProps,
        getTableBodyProps,
        headers,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize }
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
            initialState: { pageIndex: 0 },
            manualPagination: true,
            pageCount: controlledPageCount,
            autoResetPage: !skipPageReset,
            updateMyData
        },
        usePagination
    );

    React.useEffect(() => {
        fetchData({ pageIndex, pageSize })
    }, [fetchData, pageIndex, pageSize])

    return (
        <>
            <ToastContainer />
            <BTable striped bordered hover size="sm" {...getTableProps()}>
                <thead>
                    <tr>
                        {headers.map(column => (
                            <th {...column.getHeaderProps()}>
                                {column.render('Header')}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row)
                        return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                            return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            })}
                            <td>
                                <button onClick={async () => {
                                    const res = await destroy(row.values.id, accessToken);
                                    if (res.status === 200) {
                                        const dataCopy = [...data];
                                        dataCopy.splice(row.index, 1);
                                        setData(dataCopy);
                                    }
                                    
                                    notify(res.data.message);
                                }}>Delete</button>
                            </td>
                        </tr>
                        )
                    })}
                    <tr>
                        {loading ? (
                        <td>Loading...</td>
                        ) : (
                        <td>
                            Showing {page.length} of ~{total}{' '}results
                        </td>
                        )}
                    </tr>
                </tbody>
            </BTable>
            <div className="pagination">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </button>{' '}
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </button>{' '}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </button>{' '}
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                </button>{' '}
                <span>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{' '}
                </span>
                <span>
                    | Go to page:{' '}
                    <input
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={e => {
                        const page = e.target.value ? Number(e.target.value) - 1 : 0
                        gotoPage(page)
                        }}
                        style={{ width: '100px' }}
                    />
                </span>{' '}
                <select
                    value={pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value))
                    }}
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </>
    )
};

export default DataTable