// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Todo is Ownable {
  Item[] public items;
  enum Status{ CREATED, COMPLETED, CONFIRMED, DELETED }

  struct Item {
    bytes32 title;
    uint256 price;
    address assignee;
    Status status;
  }

  // TODO
  // mapping(address => Item[]) items;

  modifier onlyAssignee(uint _idx) {
    require(msg.sender == items[_idx].assignee, "Only the assignee can complete the task");

    _;
  }

  function addItem(bytes32 _title, uint _itemPrice, address _assignee) public onlyOwner {
    items.push(Item(_title, _itemPrice, _assignee, Status.CREATED));
  }

  function getItems() public view returns(Item[] memory) {
    return items;
  }

  function deleteItem(uint _idx) public onlyOwner {
    require(items[_idx].status == Status.CREATED, "Incorrect status to delete item");
    items[_idx].status = Status.DELETED;
  }

  function completeItem(uint _idx) public onlyAssignee(_idx) {
    require(items[_idx].status == Status.CREATED, "Incorrect status to complete item");
    items[_idx].status = Status.COMPLETED;
  }

  function confirmItem(uint _idx) public payable onlyOwner {
    require(items[_idx].status == Status.COMPLETED, "Incorrect status to confirm item");
    require(items[_idx].price == msg.value, "Only full payments accepted");

    ( bool success, ) = address(items[_idx].assignee).call{value:msg.value}("");
    require(success, "Transfer failed.");

    items[_idx].status = Status.CONFIRMED;
  }
}