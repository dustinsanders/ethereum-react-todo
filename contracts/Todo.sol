// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

contract Todo {
  enum Status{ CREATED, COMPLETED, CONFIRMED, DELETED }

  struct Item {
    uint id;
    bytes32 title;
    uint256 price;
    address owner;
    address assignee;
    Status status;
  }

  uint private idCounter;
  mapping(uint => Item) private items;
  mapping(address => uint[]) private itemAccess;

  modifier onlyAssignee(uint _idx) {
    require(msg.sender == items[_idx].assignee, "Assignable: caller is not the assignee");

    _;
  }

  modifier onlyOwner(uint _id) {
    require(msg.sender == items[_id].owner, "Ownable: caller is not the owner");

    _;
  }

  modifier onlyOwnerOrAssignee(uint _id) {
    require(
      msg.sender == items[_id].owner || msg.sender == items[_id].assignee,
      "Ownable/Assignable: caller is not the owner or assignee"
    );

    _;
  }

  function getItem(uint _id) public view onlyOwnerOrAssignee(_id) returns(Item memory) {
    return items[_id];
  }

  function getItems() public view returns(Item[] memory) {
    uint length = itemAccess[msg.sender].length;
    Item[] memory userItems = new Item[](length);

    for (uint i=0; i < length; i++) {
      userItems[i] = items[itemAccess[msg.sender][i]];
    }

    return userItems;
  }

  function addItem(bytes32 _title, uint _itemPrice, address _assignee) public {
    require(msg.sender != _assignee, "Item cannot be assigned to owner");
    items[idCounter] = Item(idCounter, _title, _itemPrice, msg.sender, _assignee, Status.CREATED);
    itemAccess[msg.sender].push(idCounter);
    itemAccess[_assignee].push(idCounter);
    idCounter++;
  }

  function deleteItem(uint _id) public onlyOwner(_id) {
    require(items[_id].status == Status.CREATED, "Incorrect status to delete item");
    items[_id].status = Status.DELETED;
  }

  function completeItem(uint _id) public onlyAssignee(_id) {
    require(items[_id].status == Status.CREATED, "Incorrect status to complete item");
    items[_id].status = Status.COMPLETED;
  }

  function confirmItem(uint _id) public payable onlyOwner(_id) {
    require(items[_id].status == Status.COMPLETED, "Incorrect status to confirm item");
    require(items[_id].price == msg.value, "Only full payments accepted");

    ( bool success, ) = address(items[_id].assignee).call{value:msg.value}("");
    require(success, "Transfer failed.");

    items[_id].status = Status.CONFIRMED;
  }
}