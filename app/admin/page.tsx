'use client'

import { MouseEvent } from 'react';
import {useThemeContext} from '../theme-provider'
import {Supplier} from '../lib/interfaces'

export default function Admin() {
    const context = useThemeContext(),
        suppliers = context.suppliers,
        updateSuppliers = context.updateSuppliers;

    function extractData(id: number, trElement: HTMLTableRowElement): Supplier {
        let nameElement = trElement?.querySelector('[name=name]') as HTMLInputElement,
            unitOfPurchaseElement = trElement?.querySelector('[name=unit_of_purchase]') as HTMLInputElement,
            unitAmountElement = trElement?.querySelector('[name=unit_amount]') as HTMLInputElement,
            unitCodeElement = trElement?.querySelector('[name=unit_code]') as HTMLInputElement,
            priceElement = trElement?.querySelector('[name=price]') as HTMLInputElement;

        return {
            id: id,
            name: nameElement.value,
            unit_of_purchase: unitOfPurchaseElement.value,
            unit_amount: ! isNaN(parseFloat(unitAmountElement.value)) ? parseFloat(unitAmountElement.value) : 0,
            unit_code: unitCodeElement.value,
            price: ! isNaN(parseFloat(priceElement.value)) ? parseFloat(priceElement.value) : 0,
            isEdit: false,
        };
    }

    function addSupplier(e: MouseEvent) {
        var id = suppliers.length + 1,
            trElement = (e.target as HTMLButtonElement).parentElement?.closest('tr') as HTMLTableRowElement,
            data = extractData(id, trElement);

        if (validateSupplier(data)) {
            const newSuppliers = [...suppliers.slice(0, id), data];
    
            updateSuppliers(newSuppliers);
        } else {

            alert('Fill all required fields');
        }
    }

    function editSupplier(e: MouseEvent) {
        var tbodyElement = (e.target as HTMLButtonElement).parentElement?.closest('tbody'),
            trElement = (e.target as HTMLButtonElement).parentElement?.closest('tr') as HTMLTableRowElement,
            trDataset = trElement.dataset,
            data = JSON.parse(trDataset.supplier!);

        const editSuppliers = [...suppliers].map((item) => {

            if (item.id == data.id) {
                item.isEdit = true;
            }

            return item;
        });

        updateSuppliers(editSuppliers);

        setTimeout(() => {
            let editTrElement = tbodyElement?.querySelector(`tr[data-key="${data.id}"]`),
                nameElement = editTrElement?.querySelector('[name=name]') as HTMLInputElement,
                unitOfPurchaseElement = editTrElement?.querySelector('[name=unit_of_purchase]') as HTMLInputElement,
                unitAmountElement = editTrElement?.querySelector('[name=unit_amount]') as HTMLInputElement,
                unitCodeElement = editTrElement?.querySelector('[name=unit_code]') as HTMLInputElement,
                priceElement = editTrElement?.querySelector('[name=price]') as HTMLInputElement;
            
            nameElement.value = data.name;
            unitOfPurchaseElement.value = data.unit_of_purchase;
            unitAmountElement.value = data.unit_amount;
            unitCodeElement.value = data.unit_code;
            priceElement.value = data.price;
        }, 500);
    }

    function saveSupplier(e: MouseEvent) {
        var trElement = (e.target as HTMLButtonElement).parentElement?.closest('tr') as HTMLTableRowElement,
            trDataset = trElement.dataset,
            supplier = JSON.parse(trDataset.supplier!),
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

    function deleteSupplier(index: number) {
        if (confirm('Are you sure?')) {
            updateSuppliers(suppliers.filter(item => item.id !== index));
        }
    }

    function cancelSupplier(e: MouseEvent) {
        var trElement = (e.target as HTMLButtonElement).parentElement?.closest('tr') as HTMLTableRowElement,
            trDataset = trElement.dataset,
            data = JSON.parse(trDataset.supplier!);

        const supplier = [...suppliers].map((item) => {

            if (item.id == data.id) {
                item.isEdit = false;
            }

            return item;
        });

        updateSuppliers(supplier);
    }

    function validateSupplier(data: Supplier) {
        var valid = true;

        if (! Object.keys(data).length) {
            return false;
        }

        for (const key in data) {
            if (! String(data[key as keyof Supplier]).trim()) {
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
