// server/api/shipment.post.ts
import { defineEventHandler, readBody } from 'h3'
import { add, format } from 'date-fns'

const SHIPMENT = {
  normal: {
    price: 13.98,
    days: 7
  },
  fast: {
    price: 49.98,
    days: 3
  }
} as const

interface ShipmentOption {
  price: number
  days: number
}

function shipmentPrice(shipmentOption: ShipmentOption) {
  const estimated = format(
    add(new Date(), {
      days: shipmentOption.days
    }),
    "LLLL dd, yyyy hh:mm aa"
  )

  return {
    estimated,
    price: shipmentOption.price
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  let shipment
  
  if (body.shipment === "normal") {
    shipment = shipmentPrice(SHIPMENT.normal)
  } else {
    shipment = shipmentPrice(SHIPMENT.fast)
  }

  return {
    success: true,
    shipment
  }
})