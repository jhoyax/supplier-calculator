'use client'

import { useState, MouseEvent } from 'react'
import {useThemeContext} from './theme-provider'
import {Supplier} from './lib/interfaces'

export default function Home() {
  const context = useThemeContext(),
        suppliers = context.suppliers,
        [result, setResult] = useState('');

  function handleClickCalculate(e: MouseEvent) {
    var divElement = (e.target as HTMLButtonElement).parentElement?.closest('div') as HTMLDivElement,
        unitAmountElement = divElement?.querySelector('[name=unit_amount]') as HTMLInputElement,
        unitCodeElement = divElement?.querySelector('[name=unit_code]') as HTMLInputElement,
        unit_amount = ! isNaN(parseFloat(unitAmountElement.value)) ? parseFloat(unitAmountElement.value) : 0,
        unit_code = unitCodeElement.value;

    calculateSupplier(unit_amount, unit_code);
  }

  function calculateSupplier(amount: number, code: string) {
    if (suppliers.length) {

      if (amount <= 0) {
        setResult('Input an amount greater than zero.');
        return;
      }

      // get all cheap units
      let getUnits = [],
          cheapestSupplier = suppliers[0];
      for (let index in suppliers) {
        let newSupplierUnit = convertSupplierUnitByCode(suppliers[index], code),
            newCheapestSupplierUnit = convertSupplierUnitByCode(cheapestSupplier, code),
            cheapestPricePerUnit = cheapestSupplier.price / newCheapestSupplierUnit.amount,
            pricePerUnit = suppliers[index].price / newSupplierUnit.amount;

        if (pricePerUnit <= cheapestPricePerUnit) {
          getUnits.push(newSupplierUnit.amount);
        }
      }

      // find cheapest supplier by price and closest unit
      let closestUnitAmount = getUnits.reduce((a, b) => {
        return Math.abs(b - amount) < Math.abs(a - amount) ? b : a;
      });
      for (let index in suppliers) {
        let newSupplierUnit = convertSupplierUnitByCode(suppliers[index], code),
            newCheapestSupplierUnit = convertSupplierUnitByCode(cheapestSupplier, code),
            cheapestPricePerUnit = cheapestSupplier.price / newCheapestSupplierUnit.amount,
            pricePerUnit = suppliers[index].price / newSupplierUnit.amount;


        if (
          pricePerUnit <= cheapestPricePerUnit && 
          closestUnitAmount == newSupplierUnit.amount
        ) {
          cheapestSupplier = suppliers[index];
        }
      }

      let newCheapestSupplierUnit = convertSupplierUnitByCode(cheapestSupplier, code),
          purchaseAmount = Math.ceil(amount / newCheapestSupplierUnit.amount);
      
      setResult(`We recommend you to buy from ${cheapestSupplier.name} of $${cheapestSupplier.price} per ${cheapestSupplier.unit_of_purchase} of ${cheapestSupplier.unit_amount} ${cheapestSupplier.unit_code} which gives you a total of ${pluralize(purchaseAmount, cheapestSupplier.unit_of_purchase)}.`);
    } else {
      setResult('No supplier found');
    }
  }

  function convertSupplierUnitByCode(supplier: Supplier, code: string) {
    let conversionTable = {
      'g': {
        'kg': 1000,
        'lb': 453.592,
      },
      'kg': {
        'g': 0.001,
        'lb': 0.453592,
      },
      'lb': {
        'g': 0.00220462,
        'kg': 2.20462,
      },
    };

    if (supplier.unit_code == code) {
      return {
        amount: supplier.unit_amount,
        code: supplier.unit_code,
      };
    }

    return {
      amount: supplier.unit_amount / conversionTable[supplier.unit_code as keyof {}][code],
      code: code,
    };
  }

  function pluralize(count: number, noun: string) {
    let suffixTable = {
      'bag': 's',
      'box': 'es',
      'sack': 's',
    };

    return `${count} ${noun}${count !== 1 ? suffixTable[noun as keyof {}] : ''}`;
  }

  return (
    <>
      <div className='mb-4'>
        <h1 className='text-2xl'>Get the best Supplier</h1>
        <p>Enter the number of units</p>
        <div>
          <input name='unit_amount' type="number" min="0" placeholder="Unit*" className='text-black mr-2' required />
          <select name='unit_code' className='text-black'>
            <option value="g">Gram (g)</option>
            <option value="kg">Kilogram (kg)</option>
            <option value="lb">Pound (lb)</option>
          </select>
          <button className='ml-4 p-2 bg-green-500 hover:bg-green-700' onClick={handleClickCalculate}>Calculate</button>
        </div>
      </div>

      <div className={`mb-4 ${result ? '' : 'hidden'}`}>
        <h3 className='text-xl'>Recommended Supplier</h3>
        <p>{result}</p>
      </div>
    </>
  )
}
