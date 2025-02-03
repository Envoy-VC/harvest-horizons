// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract HarvestHorizons {
    /// @notice The total number of items in the game
    uint256 public totalItems;

    struct GameItem {
        uint256 id;
        string name;
    }

    struct GameItemWithAmount {
        uint256 id;
        string name;
        uint256 amount;
    }

    enum Operation {
        Add,
        Remove
    }

    // ItemId => Item
    mapping(uint256 => GameItem) public items;
    // Address => ItemId => Amount
    mapping(address => mapping(uint256 => uint256)) public inventory;

    /// @notice Creates a new item in the game
    /// @param names The names of the items to create
    function bulkCreateItems(string[] memory names) public {
        for (uint256 i = 0; i < names.length; i++) {
            createItem(names[i]);
        }
    }

    /// @notice Creates a new item in the game
    /// @param name The name of the item to create
    function createItem(string memory name) public {
        GameItem memory item = GameItem(totalItems, name);
        totalItems++;
        items[totalItems] = item;
    }

    /// @notice Adds an item to the player's inventory
    /// @param player The address of the player to add the item to
    /// @param itemId The id of the item to add
    /// @param amount The amount of the item to add
    function addToInventory(address player, uint256 itemId, uint256 amount) public {
        inventory[player][itemId] += amount;
    }

    /// @notice Removes an item from the player's inventory
    /// @param player The address of the player to remove the item from
    /// @param itemId The id of the item to remove
    /// @param amount The amount of the item to remove
    function removeFromInventory(address player, uint256 itemId, uint256 amount) public {
        inventory[player][itemId] -= amount;
    }

    /// @notice Edits the inventory of a player
    /// @param player The address of the player to edit the inventory of
    /// @param itemIds The ids of the items to edit
    /// @param amounts The amounts of the items to edit
    /// @param operations The operations to perform on the items
    /// Operation.Add: Adds the specified amount of the item to the player's inventory
    /// Operation.Remove: Removes the specified amount of the item from the player's inventory
    function bulkEditInventory(
        address player,
        uint256[] memory itemIds,
        uint256[] memory amounts,
        Operation[] memory operations
    ) public {
        for (uint256 i = 0; i < itemIds.length; i++) {
            if (operations[i] == Operation.Add) {
                addToInventory(player, itemIds[i], amounts[i]);
            } else if (operations[i] == Operation.Remove) {
                removeFromInventory(player, itemIds[i], amounts[i]);
            }
        }
    }

    /// @notice Gets the inventory of a player
    /// @param player The address of the player to get the inventory of
    /// @return _items The inventory of the player
    function getPlayerInventory(address player) public view returns (GameItemWithAmount[] memory) {
        GameItemWithAmount[] memory _items = new GameItemWithAmount[](totalItems);
        for (uint256 i = 0; i < totalItems; i++) {
            uint256 amount = inventory[player][i];
            _items[i] = GameItemWithAmount(i, items[i].name, amount);
        }
        return _items;
    }
}
