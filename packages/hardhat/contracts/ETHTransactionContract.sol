// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title ETHTransactionContract
 * @dev Contract for handling ETH transactions and EcoCred token rewards
 */
contract ETHTransactionContract is Ownable, ReentrancyGuard {
    // Events
    event ActionCompleted(address indexed user, string actionType, uint256 xpReward, uint256 tokenReward);
    event TokensRedeemed(address indexed user, string rewardName, uint256 tokensCost);
    event ETHWithdrawn(address indexed owner, uint256 amount);
    event ETHTransferred(address indexed from, address indexed to, uint256 amount);

    // Structs
    struct UserProfile {
        uint256 tokenBalance;
        uint256 totalActionsCompleted;
        uint256 totalXPEarned;
        mapping(string => uint256) actionCounts;
    }

    struct Action {
        string name;
        uint256 xpReward;
        uint256 cost;
        bool requiresPayment;
    }

    struct Reward {
        string name;
        uint256 tokenCost;
        bool requiresAdultLevel;
        bool isActive;
    }

    // State variables
    mapping(address => UserProfile) public userProfiles;
    mapping(string => Action) public actions;
    mapping(string => Reward) public rewards;
    
    string[] public actionNames;
    string[] public rewardNames;
    
    uint256 public constant TOKENS_PER_ACTION = 1;
    
    // Constructor
    constructor() {
        // Initialize sustainable actions
        _addAction("public_transport", "Public Transportation", 10, 0.0005 ether, true);
        _addAction("community_cleanup", "Community Cleanup", 18, 0, false);
        _addAction("recycling", "Recycle Waste", 15, 0, false);
        _addAction("tree_planting", "Plant a Tree", 20, 0, false);
        
        // Initialize rewards
        _addReward("mrt_day_pass", "Free MRT/LRT Day Pass", 200, false);
        _addReward("transport_discount", "50% Discount on Monthly Public Transport Pass", 500, false);
        _addReward("eco_badge", "EcoWarrior Badge", 100, false);
        _addReward("eco_tshirt", "Limited Edition EcoCred T-Shirt", 700, false);
        _addReward("beauty_discount", "RM 20 off on Beauty & Wellness Product", 1000, true);
        _addReward("grocer_discount", "RM 10 off at Jaya Grocer", 700, true);
    }

    // Internal functions
    function _addAction(string memory id, string memory name, uint256 xpReward, uint256 cost, bool requiresPayment) internal {
        actions[id] = Action(name, xpReward, cost, requiresPayment);
        actionNames.push(id);
    }

    function _addReward(string memory id, string memory name, uint256 tokenCost, bool requiresAdultLevel) internal {
        rewards[id] = Reward(name, tokenCost, requiresAdultLevel, true);
        rewardNames.push(id);
    }

    // Public functions
    function performAction(string memory actionId) external payable nonReentrant {
        Action memory action = actions[actionId];
        require(bytes(action.name).length > 0, "Action does not exist");
        
        if (action.requiresPayment) {
            require(msg.value >= action.cost, "Insufficient payment");
        }
        
        UserProfile storage user = userProfiles[msg.sender];
        user.tokenBalance += TOKENS_PER_ACTION;
        user.totalActionsCompleted += 1;
        user.totalXPEarned += action.xpReward;
        user.actionCounts[actionId] += 1;
        
        emit ActionCompleted(msg.sender, action.name, action.xpReward, TOKENS_PER_ACTION);
    }

    function redeemReward(string memory rewardId, uint256 ecoPetLevel) external nonReentrant {
        Reward memory reward = rewards[rewardId];
        require(bytes(reward.name).length > 0, "Reward does not exist");
        require(reward.isActive, "Reward is not active");
        
        UserProfile storage user = userProfiles[msg.sender];
        require(user.tokenBalance >= reward.tokenCost, "Insufficient tokens");
        
        if (reward.requiresAdultLevel) {
            require(ecoPetLevel >= 17, "EcoPet must be Adult level (17+) to redeem this reward");
        }
        
        user.tokenBalance -= reward.tokenCost;
        
        emit TokensRedeemed(msg.sender, reward.name, reward.tokenCost);
    }

    function transferETH(address payable to, uint256 amount) external nonReentrant {
        require(to != address(0), "Invalid recipient address");
        require(address(this).balance >= amount, "Insufficient contract balance");
        
        to.transfer(amount);
        emit ETHTransferred(msg.sender, to, amount);
    }

    function withdrawAll() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        payable(owner()).transfer(balance);
        emit ETHWithdrawn(owner(), balance);
    }

    function withdrawAmount(uint256 amount) external onlyOwner nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(address(this).balance >= amount, "Insufficient contract balance");
        
        payable(owner()).transfer(amount);
        emit ETHWithdrawn(owner(), amount);
    }

    // View functions
    function getUserProfile(address user) external view returns (
        uint256 tokenBalance,
        uint256 totalActionsCompleted,
        uint256 totalXPEarned
    ) {
        UserProfile storage profile = userProfiles[user];
        return (profile.tokenBalance, profile.totalActionsCompleted, profile.totalXPEarned);
    }

    function getUserActionCount(address user, string memory actionId) external view returns (uint256) {
        return userProfiles[user].actionCounts[actionId];
    }

    function getAction(string memory actionId) external view returns (
        string memory name,
        uint256 xpReward,
        uint256 cost,
        bool requiresPayment
    ) {
        Action memory action = actions[actionId];
        return (action.name, action.xpReward, action.cost, action.requiresPayment);
    }

    function getReward(string memory rewardId) external view returns (
        string memory name,
        uint256 tokenCost,
        bool requiresAdultLevel,
        bool isActive
    ) {
        Reward memory reward = rewards[rewardId];
        return (reward.name, reward.tokenCost, reward.requiresAdultLevel, reward.isActive);
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getAllActionNames() external view returns (string[] memory) {
        return actionNames;
    }

    function getAllRewardNames() external view returns (string[] memory) {
        return rewardNames;
    }

    // Fallback function to receive ETH
    receive() external payable {}
}
