// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./EcoPet.sol";

/**
 * @title EcoCred
 * @dev ERC-20 token for rewarding sustainable actions with EcoPet integration
 */
contract EcoCred is ERC20, Ownable {
    // Events
    event SustainableActionCompleted(address indexed user, string actionType, uint256 tokensEarned, uint256 xpGained);
    event RewardRedeemed(address indexed user, string rewardType, uint256 tokensBurned);
    event EcoPetAssigned(address indexed user, uint256 tokenId);

    // Structs
    struct ActionData {
        string name;
        uint256 tokenReward;
        uint256 xpReward;
        uint256 ethCost;
        bool isActive;
    }

    struct RewardData {
        string name;
        uint256 tokenCost;
        string description;
        bool isActive;
    }

    // State variables
    EcoPet public ecoPetContract;
    
    mapping(string => ActionData) public sustainableActions;
    mapping(string => RewardData) public rewards;
    mapping(address => uint256) public userTokensEarned;
    mapping(address => uint256) public userActionsCompleted;
    mapping(address => bool) public hasEcoPet;
    
    string[] public availableActions;
    string[] public availableRewards;

    constructor(address _ecoPetContract) ERC20("EcoCred", "ECO") {
        ecoPetContract = EcoPet(_ecoPetContract);
        _initializeActions();
        _initializeRewards();
    }

    function _initializeActions() private {
        // Public Transport - Updated cost to 0.00005 ETH
        sustainableActions["public_transport"] = ActionData({
            name: "Use Public Transport",
            tokenReward: 10,
            xpReward: 10,
            ethCost: 0.00005 ether,
            isActive: true
        });
        availableActions.push("public_transport");

        // Community Cleanup
        sustainableActions["cleanup"] = ActionData({
            name: "Community Cleanup",
            tokenReward: 18,
            xpReward: 18,
            ethCost: 0.0001 ether,
            isActive: true
        });
        availableActions.push("cleanup");

        // Recycling
        sustainableActions["recycling"] = ActionData({
            name: "Recycling",
            tokenReward: 15,
            xpReward: 15,
            ethCost: 0.00008 ether,
            isActive: true
        });
        availableActions.push("recycling");

        // Tree Planting
        sustainableActions["tree_planting"] = ActionData({
            name: "Tree Planting",
            tokenReward: 20,
            xpReward: 20,
            ethCost: 0.00012 ether,
            isActive: true
        });
        availableActions.push("tree_planting");
    }

    function _initializeRewards() private {
        rewards["eco_badge"] = RewardData({
            name: "Eco Warrior Badge",
            tokenCost: 50,
            description: "Digital badge recognizing your environmental efforts",
            isActive: true
        });
        availableRewards.push("eco_badge");

        rewards["tree_certificate"] = RewardData({
            name: "Tree Planting Certificate",
            tokenCost: 100,
            description: "Certificate for contributing to reforestation",
            isActive: true
        });
        availableRewards.push("tree_certificate");

        rewards["carbon_offset"] = RewardData({
            name: "Carbon Offset Credits",
            tokenCost: 200,
            description: "Credits to offset your carbon footprint",
            isActive: true
        });
        availableRewards.push("carbon_offset");

        rewards["eco_merchandise"] = RewardData({
            name: "Eco-Friendly Merchandise",
            tokenCost: 150,
            description: "Sustainable products made from recycled materials",
            isActive: true
        });
        availableRewards.push("eco_merchandise");
    }

    function completeSustainableAction(string memory actionType) external payable {
        ActionData memory action = sustainableActions[actionType];
        require(action.isActive, "Action is not available");
        require(msg.value >= action.ethCost, "Insufficient ETH sent");

        // Ensure user has an EcoPet, create one if they don't
        if (!hasEcoPet[msg.sender] && !ecoPetContract.hasPet(msg.sender)) {
            ecoPetContract.createEcoPet("EcoFriend");
            hasEcoPet[msg.sender] = true;
            emit EcoPetAssigned(msg.sender, ecoPetContract.ownerToPetId(msg.sender));
        }

        // Mint tokens to user
        _mint(msg.sender, action.tokenReward);
        
        // Record action in EcoPet contract for mood tracking
        ecoPetContract.recordAction(msg.sender, actionType);
        
        // Add XP to EcoPet
        ecoPetContract.addXP(msg.sender, action.xpReward);
        
        // Update user stats
        userTokensEarned[msg.sender] += action.tokenReward;
        userActionsCompleted[msg.sender] += 1;

        // Refund excess ETH
        if (msg.value > action.ethCost) {
            payable(msg.sender).transfer(msg.value - action.ethCost);
        }

        emit SustainableActionCompleted(msg.sender, actionType, action.tokenReward, action.xpReward);
    }

    function redeemReward(string memory rewardType) external {
        RewardData memory reward = rewards[rewardType];
        require(reward.isActive, "Reward is not available");
        require(balanceOf(msg.sender) >= reward.tokenCost, "Insufficient tokens");

        // Burn tokens (simulate token burn by transferring to contract)
        _transfer(msg.sender, address(this), reward.tokenCost);
        
        // Reset EcoPet XP as part of reward redemption
        if (hasEcoPet[msg.sender] || ecoPetContract.hasPet(msg.sender)) {
            ecoPetContract.resetXP(msg.sender);
        }

        emit RewardRedeemed(msg.sender, rewardType, reward.tokenCost);
    }

    // View functions
    function getActionData(string memory actionType) external view returns (
        string memory name,
        uint256 tokenReward,
        uint256 xpReward,
        uint256 ethCost,
        bool isActive
    ) {
        ActionData memory action = sustainableActions[actionType];
        return (action.name, action.tokenReward, action.xpReward, action.ethCost, action.isActive);
    }

    function getRewardData(string memory rewardType) external view returns (
        string memory name,
        uint256 tokenCost,
        string memory description,
        bool isActive
    ) {
        RewardData memory reward = rewards[rewardType];
        return (reward.name, reward.tokenCost, reward.description, reward.isActive);
    }

    function getAllActions() external view returns (string[] memory) {
        return availableActions;
    }

    function getAllRewards() external view returns (string[] memory) {
        return availableRewards;
    }

    function getUserStats(address user) external view returns (
        uint256 tokenBalance,
        uint256 tokensEarned,
        uint256 actionsCompleted,
        bool userHasEcoPet
    ) {
        return (
            balanceOf(user),
            userTokensEarned[user],
            userActionsCompleted[user],
            hasEcoPet[user] || ecoPetContract.hasPet(user)
        );
    }

    // Admin functions
    function updateAction(
        string memory actionType,
        string memory name,
        uint256 tokenReward,
        uint256 xpReward,
        uint256 ethCost,
        bool isActive
    ) external onlyOwner {
        sustainableActions[actionType] = ActionData(name, tokenReward, xpReward, ethCost, isActive);
    }

    function updateReward(
        string memory rewardType,
        string memory name,
        uint256 tokenCost,
        string memory description,
        bool isActive
    ) external onlyOwner {
        rewards[rewardType] = RewardData(name, tokenCost, description, isActive);
    }

    function withdrawETH() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function setEcoPetContract(address _ecoPetContract) external onlyOwner {
        ecoPetContract = EcoPet(_ecoPetContract);
    }
}
