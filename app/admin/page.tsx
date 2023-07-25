'use client'

import {useThemeContext} from './../theme-provider'

export default function Admin() {
    const [suppliers, updateSuppliers] = useThemeContext();

    function extractData(id: string, trElement: object) {
        return {
            id: id,
            name: trElement.querySelector('[name=name]').value,
            unit_of_purchase: trElement.querySelector('[name=unit_of_purchase]').value,
            unit_amount: ! isNaN(parseFloat(trElement.querySelector('[name=unit_amount]').value)) ? parseFloat(trElement.querySelector('[name=unit_amount]').value) : '',
            unit_code: trElement.querySelector('[name=unit_code]').value,
            price: ! isNaN(parseFloat(trElement.querySelector('[name=price]').value)) ? parseFloat(trElement.querySelector('[name=price]').value) : '',
            isEdit: false,
        };
    }

    function addSupplier(e: object) {
        var id = suppliers.length + 1,
            trElement = e.target.parentElement.closest('tr'),
            data = extractData(id, trElement);

        if (validateSupplier(data)) {
            const newSuppliers = [...suppliers.slice(0, id), data];
    
            updateSuppliers(newSuppliers);
        } else {

            alert('Fill all required fields');
        }
    }

    function editSupplier(e: object) {
        var tbodyElement = e.target.parentElement.closest('tbody'),
            trElement = e.target.parentElement.closest('tr'),
            data = JSON.parse(trElement.dataset.supplier);

        const editSuppliers = [...suppliers].map((item) => {

            if (item.id == data.id) {
                item.isEdit = true;
            }

            return item;
        });

        updateSuppliers(editSuppliers);

        setTimeout(() => {
            let editTrElement = tbodyElement.querySelector(`tr[data-key="${data.id}"]`);
            editTrElement.querySelector('[name=name]').value = data.name;
            editTrElement.querySelector('[name=unit_of_purchase]').value = data.unit_of_purchase;
            editTrElement.querySelector('[name=unit_amount]').value = data.unit_amount;
            editTrElement.querySelector('[name=unit_code]').value = data.unit_code;
            editTrElement.querySelector('[name=price]').value = data.price;
        }, 500);
    }

    function saveSupplier(e: object) {
        var trElement = e.target.parentElement.closest('tr'),
            supplier = JSON.parse(trElement.dataset.supplier),
            data = extractData(supplier.id, trElement);

        if (validateSupplier(data)) {
            const saveSuppliers = [...suppliers].map((item) => { 
                if (item.id == data.id) {
                    return data;
                }

                return item;
            });
    
            updateSuppliers(saveSuppliers);
        } else {

            alert('Fill all required fields');
        }
    }

    function deleteSupplier(index: string) {
        if (confirm('Are you sure?')) {
            updateSuppliers(suppliers.filter(item => item.id !== index));
        }
    }

    function cancelSupplier(e: object) {
        var trElement = e.target.parentElement.closest('tr'),
            data = JSON.parse(trElement.dataset.supplier);

        const supplier = [...suppliers].map((item) => {

            if (item.id == data.id) {
                item.isEdit = false;
            }

            return item;
        });

        updateSuppliers(supplier);
    }

    function validateSupplier(data: object = {}) {
        var valid = true;

        if (! Object.keys(data).length) {
            return false;
        }

        for (const key in data) {
            if (! String(data[key]).trim()) {
                valid = false;
                break;
            }
        }

        return valid;
    }

    const listOfSuppliers = suppliers.map((supplier) => {
        if ( supplier.isEdit ) {
            return (
                <tr key={supplier.id} data-key={supplier.id} data-supplier={JSON.stringify(supplier)}>
                    <td className='border p-4 pl-8'>
                        <input type="text" name="name" className='text-black w-full' placeholder="Name*" required />
                    </td>
                    <td className='border p-4 pl-8'>
                        <select name="unit_of_purchase" className='text-black w-full'>
                            <option value="bag">bag</option>
                            <option value="box">box</option>
                            <option value="sack">sack</option>
                        </select>
                    </td>
                    <td className='border p-4 pl-8 grid grid-cols-2'>
                        <input name="unit_amount" type="number" min="1" className='text-black mr-2' placeholder="Unit*" required />
                        <select name="unit_code" className='text-black'>
                            <option value="g">Gram (g)</option>
                            <option value="kg">Kilogram (kg)</option>
                            <option value="lb">Pound (lb)</option>
                        </select>
                    </td>
                    <td className='border p-4 pl-8'>
                        <input name="price" type="number" min="1" className='text-black w-full read-only:bg-gray-300' placeholder="Price*" required />
                    </td>
                    <td className='border p-4 pl-8'>
                        <ul className='flex'>
                            <li className='mr-2'><button type='submit' className='p-2 bg-violet-500 hover:bg-violet-700' onClick={saveSupplier}>Save</button></li>
                            <li><button className='p-2 bg-yellow-500 hover:bg-yellow-700' onClick={cancelSupplier}>Cancel</button></li>
                        </ul>
                    </td>
                </tr>
            );
        }

        return (
            <tr key={supplier.id} data-key={supplier.id} data-supplier={JSON.stringify(supplier)}>
                <td className='border p-4 pl-8'>{supplier.name}</td>
                <td className='border p-4 pl-8'>{supplier.unit_of_purchase}</td>
                <td className='border p-4 pl-8'>{supplier.unit_amount} {supplier.unit_code}</td>
                <td className='border p-4 pl-8'>$ {supplier.price}</td>
                <td className='border p-4 pl-8'>
                    <ul className='flex'>
                        <li className='mr-2'><button className='p-2 bg-blue-500 hover:bg-blue-700' onClick={editSupplier}>Edit</button></li>
                        <li><button className='p-2 bg-red-500 hover:bg-red-700' onClick={() => deleteSupplier(supplier.id)}>Delete</button></li>
                    </ul>
                </td>
            </tr>
        );
    });

    return (
        <>
            <table className='table-fixed w-full'>
                <thead>
                    <tr>
                        <th className='border text-left p-4 pl-8'>Name</th>
                        <th className='border text-left p-4 pl-8'>Unit Of Purchase</th>
                        <th className='border text-left p-4 pl-8'>Units</th>
                        <th className='border text-left p-4 pl-8'>Price</th>
                        <th className='border text-left p-4 pl-8'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {listOfSuppliers}
                </tbody>
                <tfoot>
                    <tr>
                        <td className='border p-4 pl-8'>
                            <input type="text" name="name" className='text-black w-full' placeholder="Name*" required />
                        </td>
                        <td className='border p-4 pl-8'>
                            <select name="unit_of_purchase" className='text-black w-full'>
                                <option value="bag">bag</option>
                                <option value="box">box</option>
                                <option value="sack">sack</option>
                            </select>
                        </td>
                        <td className='border p-4 pl-8 grid grid-cols-2'>
                            <input name="unit_amount" type="number" min="1" className='text-black mr-2' placeholder="Unit*" required />
                            <select name="unit_code" className='text-black'>
                                <option value="g">Gram (g)</option>
                                <option value="kg">Kilogram (kg)</option>
                                <option value="lb">Pound (lb)</option>
                            </select>
                        </td>
                        <td className='border p-4 pl-8'>
                            <input name="price" type="number" min="1" className='text-black w-full' placeholder="Price*" required />
                        </td>
                        <td className='border p-4 pl-8'>
                            <ul>
                                <li><button type='submit' className='p-2 bg-green-500 hover:bg-green-700' onClick={(e) => addSupplier(e)}>Add</button></li>
                            </ul>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </>
    )
}
