// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Todo is Ownable {
  Item[] public items;

  struct Item {
    bytes32 title;
    uint price;
    address assignee;
    bool completed;
    bool deleted;
    bool confirmed;
  }

  modifier onlyAssignee(uint _idx) {
    require(msg.sender == items[_idx].assignee, "Only the assignee can complete the task");

    _;
  }

  function addItem(bytes32 _title, uint _itemPrice, address _assignee) public onlyOwner {
    items.push(Item(_title, _itemPrice, _assignee, false, false, false));
  }

  function getItems() public view returns(Item[] memory) {
    return items;
  }

  function deleteItem(uint _idx) public onlyOwner {
    items[_idx].deleted = true;
  }

  function completeItem(uint _idx) public onlyAssignee(_idx) {
    items[_idx].completed = true;
  }

  function confirmItem(uint _idx) public payable onlyOwner {
    require(items[_idx].completed == true, "Item has not been completed yet.");
    require(items[_idx].confirmed == false, "Item has already been confirmed and paid for.");
    require(items[_idx].price == msg.value, "Only full payments accepted.");

    ( bool success, ) = address(items[_idx].assignee).call{value:msg.value}("");
    require(success, "Transfer failed.");

    items[_idx].confirmed = true;
  }
}