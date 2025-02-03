export const harvestHorizonsAddress =
  '0xB42f3232828e044129A937Bb3dfc359Ae6c20b1B' as const;

export const ABI = [
  {
    type: 'function',
    name: 'addToInventory',
    inputs: [
      { name: 'player', type: 'address', internalType: 'address' },
      { name: 'itemId', type: 'uint256', internalType: 'uint256' },
      { name: 'amount', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'bulkCreateItems',
    inputs: [{ name: 'names', type: 'string[]', internalType: 'string[]' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'bulkEditInventory',
    inputs: [
      { name: 'player', type: 'address', internalType: 'address' },
      { name: 'itemIds', type: 'uint256[]', internalType: 'uint256[]' },
      { name: 'amounts', type: 'uint256[]', internalType: 'uint256[]' },
      {
        name: 'operations',
        type: 'uint8[]',
        internalType: 'enum HarvestHorizons.Operation[]',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'createItem',
    inputs: [{ name: 'name', type: 'string', internalType: 'string' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getPlayerInventory',
    inputs: [{ name: 'player', type: 'address', internalType: 'address' }],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        internalType: 'struct HarvestHorizons.GameItemWithAmount[]',
        components: [
          { name: 'id', type: 'uint256', internalType: 'uint256' },
          { name: 'name', type: 'string', internalType: 'string' },
          { name: 'amount', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'inventory',
    inputs: [
      { name: '', type: 'address', internalType: 'address' },
      { name: '', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'items',
    inputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    outputs: [
      { name: 'id', type: 'uint256', internalType: 'uint256' },
      { name: 'name', type: 'string', internalType: 'string' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'removeFromInventory',
    inputs: [
      { name: 'player', type: 'address', internalType: 'address' },
      { name: 'itemId', type: 'uint256', internalType: 'uint256' },
      { name: 'amount', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'totalItems',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
] as const;

export const harvestHorizonsConfig = {
  address: harvestHorizonsAddress,
  abi: ABI,
} as const;
