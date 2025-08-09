// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title EcoPet
 * @dev ERC-721 Non-Fungible Agent (NFA) contract for EcoPet characters with mood mechanics
 */
contract EcoPet is ERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

    // Events
    event EcoPetCreated(address indexed owner, uint256 indexed tokenId, string name);
    event EcoPetLevelUp(uint256 indexed tokenId, uint256 newLevel, string newStage);
    event XPAdded(uint256 indexed tokenId, uint256 xpAdded, uint256 totalXP);
    event MoodUpdated(uint256 indexed tokenId, string newMood, uint256 timestamp);
    event ActionRecorded(address indexed owner, uint256 indexed tokenId, string actionType, uint256 timestamp);

    // Structs
    struct PetData {
        string name;
        uint256 xp;
        uint256 level;
        string stage;
        uint256 createdAt;
        string[] traits;
        string imageURI;
        string mood;
        uint256 lastActionTimestamp;
        uint256[5] recentActionTimestamps; // Store last 5 action timestamps
        uint8 actionCount; // Track how many actions are stored (max 5)
    }

    // State variables
    Counters.Counter private _tokenIdCounter;
    mapping(uint256 => PetData) public pets;
    mapping(address => uint256) public ownerToPetId;
    mapping(address => bool) public hasPet;
    
    // Constants
    uint256 public constant XP_PER_LEVEL = 100;
    uint256 public constant BABY_STAGE_MAX = 699;
    uint256 public constant YOUTH_STAGE_MAX = 1699;
    
    // Mood timing constants (in seconds)
    uint256 public constant HAPPY_THRESHOLD = 3 days;
    uint256 public constant NEUTRAL_THRESHOLD = 7 days;
    // Sad mood is anything beyond NEUTRAL_THRESHOLD
    
    string[] private defaultTraits = ["Curious", "Eco-Friendly"];
    
    // Pet images for different stages
    string private babyImageURI = "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=300&h=300&fit=crop&crop=center";
    string private youthImageURI = "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop&crop=center";
    string private adultImageURI = "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=300&fit=crop&crop=center";

    constructor() ERC721("EcoPet", "ECOPET") {}

    // Public functions
    function createEcoPet(string memory petName) external {
        require(!hasPet[msg.sender], "User already has an EcoPet");
        require(bytes(petName).length > 0, "Pet name cannot be empty");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(msg.sender, tokenId);
        
        // Initialize empty action timestamps array
        uint256[5] memory emptyTimestamps;
        
        pets[tokenId] = PetData({
            name: petName,
            xp: 0,
            level: 1,
            stage: "Baby",
            createdAt: block.timestamp,
            traits: defaultTraits,
            imageURI: babyImageURI,
            mood: "Happy",
            lastActionTimestamp: block.timestamp,
            recentActionTimestamps: emptyTimestamps,
            actionCount: 0
        });
        
        ownerToPetId[msg.sender] = tokenId;
        hasPet[msg.sender] = true;
        
        emit EcoPetCreated(msg.sender, tokenId, petName);
    }

    function recordAction(address petOwner, string memory actionType) external {
        require(hasPet[petOwner], "User does not have an EcoPet");
        
        uint256 tokenId = ownerToPetId[petOwner];
        PetData storage pet = pets[tokenId];
        
        // Update last action timestamp
        pet.lastActionTimestamp = block.timestamp;
        
        // Add to recent actions array (circular buffer)
        uint8 index = pet.actionCount % 5;
        pet.recentActionTimestamps[index] = block.timestamp;
        
        if (pet.actionCount < 5) {
            pet.actionCount++;
        }
        
        // Update mood to Happy since user just performed an action
        pet.mood = "Happy";
        
        emit ActionRecorded(petOwner, tokenId, actionType, block.timestamp);
        emit MoodUpdated(tokenId, "Happy", block.timestamp);
    }

    function addXP(address petOwner, uint256 xpAmount) external {
        require(hasPet[petOwner], "User does not have an EcoPet");
        
        uint256 tokenId = ownerToPetId[petOwner];
        PetData storage pet = pets[tokenId];
        
        uint256 oldLevel = pet.level;
        string memory oldStage = pet.stage;
        
        pet.xp += xpAmount;
        pet.level = (pet.xp / XP_PER_LEVEL) + 1;
        
        // Update stage and image based on XP
        if (pet.xp <= BABY_STAGE_MAX) {
            pet.stage = "Baby";
            pet.imageURI = babyImageURI;
        } else if (pet.xp <= YOUTH_STAGE_MAX) {
            pet.stage = "Youth";
            pet.imageURI = youthImageURI;
            // Add new traits for Youth stage
            if (keccak256(bytes(oldStage)) == keccak256(bytes("Baby"))) {
                pet.traits.push("Adventurous");
            }
        } else {
            pet.stage = "Adult";
            pet.imageURI = adultImageURI;
            // Add new traits for Adult stage
            if (keccak256(bytes(oldStage)) != keccak256(bytes("Adult"))) {
                pet.traits.push("Wise");
                pet.traits.push("Leader");
            }
        }
        
        emit XPAdded(tokenId, xpAmount, pet.xp);
        
        // Emit level up event if level changed
        if (pet.level > oldLevel || keccak256(bytes(pet.stage)) != keccak256(bytes(oldStage))) {
            emit EcoPetLevelUp(tokenId, pet.level, pet.stage);
        }
    }

    function feedPet(address petOwner, uint256 tokensEarned) external {
        // Each token earned gives XP based on the action that earned it
        // This function can be called by the main contract when tokens are earned
        addXP(petOwner, tokensEarned * 10); // 10 XP per token as base
    }

    function resetXP(address petOwner) external {
        require(hasPet[petOwner], "User does not have an EcoPet");
        
        uint256 tokenId = ownerToPetId[petOwner];
        PetData storage pet = pets[tokenId];
        
        // Reset XP and level but keep other progress
        pet.xp = 0;
        pet.level = 1;
        pet.stage = "Baby";
        pet.imageURI = babyImageURI;
        
        // Reset traits to default
        delete pet.traits;
        pet.traits = defaultTraits;
        
        emit EcoPetLevelUp(tokenId, 1, "Baby");
    }

    // View functions
    function getPetData(address owner) external view returns (
        uint256 tokenId,
        string memory name,
        uint256 xp,
        uint256 level,
        string memory stage,
        uint256 createdAt,
        string[] memory traits,
        string memory imageURI,
        string memory mood,
        uint256 lastActionTimestamp
    ) {
        require(hasPet[owner], "User does not have an EcoPet");
        
        tokenId = ownerToPetId[owner];
        PetData memory pet = pets[tokenId];
        
        return (
            tokenId,
            pet.name,
            pet.xp,
            pet.level,
            pet.stage,
            pet.createdAt,
            pet.traits,
            pet.imageURI,
            _calculateCurrentMood(tokenId),
            pet.lastActionTimestamp
        );
    }

    function getPetMood(address owner) external view returns (string memory) {
        require(hasPet[owner], "User does not have an EcoPet");
        
        uint256 tokenId = ownerToPetId[owner];
        return _calculateCurrentMood(tokenId);
    }

    function getRecentActions(address owner) external view returns (uint256[5] memory, uint8) {
        require(hasPet[owner], "User does not have an EcoPet");
        
        uint256 tokenId = ownerToPetId[owner];
        PetData memory pet = pets[tokenId];
        
        return (pet.recentActionTimestamps, pet.actionCount);
    }

    function _calculateCurrentMood(uint256 tokenId) internal view returns (string memory) {
        PetData memory pet = pets[tokenId];
        
        if (pet.lastActionTimestamp == 0) {
            return "Neutral";
        }
        
        uint256 timeSinceLastAction = block.timestamp - pet.lastActionTimestamp;
        
        if (timeSinceLastAction <= HAPPY_THRESHOLD) {
            return "Happy";
        } else if (timeSinceLastAction <= NEUTRAL_THRESHOLD) {
            return "Neutral";
        } else {
            return "Sad";
        }
    }

    function getPetByTokenId(uint256 tokenId) external view returns (
        string memory name,
        uint256 xp,
        uint256 level,
        string memory stage,
        uint256 createdAt,
        string[] memory traits,
        string memory imageURI,
        string memory mood
    ) {
        require(_exists(tokenId), "Pet does not exist");
        
        PetData memory pet = pets[tokenId];
        return (
            pet.name,
            pet.xp,
            pet.level,
            pet.stage,
            pet.createdAt,
            pet.traits,
            pet.imageURI,
            _calculateCurrentMood(tokenId)
        );
    }

    function getXPToNextLevel(address owner) external view returns (uint256) {
        require(hasPet[owner], "User does not have an EcoPet");
        
        uint256 tokenId = ownerToPetId[owner];
        PetData memory pet = pets[tokenId];
        
        uint256 currentLevelXP = pet.xp % XP_PER_LEVEL;
        return XP_PER_LEVEL - currentLevelXP;
    }

    function getProgressToNextLevel(address owner) external view returns (uint256) {
        require(hasPet[owner], "User does not have an EcoPet");
        
        uint256 tokenId = ownerToPetId[owner];
        PetData memory pet = pets[tokenId];
        
        return (pet.xp % XP_PER_LEVEL) * 100 / XP_PER_LEVEL; // Returns percentage (0-100)
    }

    function isAdultLevel(address owner) external view returns (bool) {
        if (!hasPet[owner]) return false;
        
        uint256 tokenId = ownerToPetId[owner];
        return pets[tokenId].xp > YOUTH_STAGE_MAX;
    }

    // Admin functions
    function updatePetImageURIs(
        string memory _babyImageURI,
        string memory _youthImageURI,
        string memory _adultImageURI
    ) external onlyOwner {
        babyImageURI = _babyImageURI;
        youthImageURI = _youthImageURI;
        adultImageURI = _adultImageURI;
    }

    // Override functions required by Solidity
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Pet does not exist");
        return pets[tokenId].imageURI;
    }
}
