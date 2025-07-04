/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../common";

export declare namespace ArtifactNFT {
  export type ArtifactStatsStruct = {
    healthBonus: BigNumberish;
    attackBonus: BigNumberish;
    defenseBonus: BigNumberish;
    speedBonus: BigNumberish;
    magicBonus: BigNumberish;
    luckBonus: BigNumberish;
  };

  export type ArtifactStatsStructOutput = [
    healthBonus: bigint,
    attackBonus: bigint,
    defenseBonus: bigint,
    speedBonus: bigint,
    magicBonus: bigint,
    luckBonus: bigint
  ] & {
    healthBonus: bigint;
    attackBonus: bigint;
    defenseBonus: bigint;
    speedBonus: bigint;
    magicBonus: bigint;
    luckBonus: bigint;
  };

  export type ArtifactStruct = {
    name: string;
    artifactType: BigNumberish;
    rarity: BigNumberish;
    stats: ArtifactNFT.ArtifactStatsStruct;
    specialEffect: BigNumberish;
    effectPower: BigNumberish;
    essence: string;
    isEquipped: boolean;
    equippedTo: BigNumberish;
    charges: BigNumberish;
    maxCharges: BigNumberish;
  };

  export type ArtifactStructOutput = [
    name: string,
    artifactType: bigint,
    rarity: bigint,
    stats: ArtifactNFT.ArtifactStatsStructOutput,
    specialEffect: bigint,
    effectPower: bigint,
    essence: string,
    isEquipped: boolean,
    equippedTo: bigint,
    charges: bigint,
    maxCharges: bigint
  ] & {
    name: string;
    artifactType: bigint;
    rarity: bigint;
    stats: ArtifactNFT.ArtifactStatsStructOutput;
    specialEffect: bigint;
    effectPower: bigint;
    essence: string;
    isEquipped: boolean;
    equippedTo: bigint;
    charges: bigint;
    maxCharges: bigint;
  };
}

export interface ArtifactNFTInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "approve"
      | "artifacts"
      | "balanceOf"
      | "craft"
      | "craftPrice"
      | "equipArtifact"
      | "getApproved"
      | "getArtifact"
      | "getOwnerArtifacts"
      | "isApprovedForAll"
      | "name"
      | "owner"
      | "ownerArtifacts"
      | "ownerOf"
      | "rechargeArtifact"
      | "rechargePrice"
      | "renounceOwnership"
      | "safeTransferFrom(address,address,uint256)"
      | "safeTransferFrom(address,address,uint256,bytes)"
      | "setApprovalForAll"
      | "setCraftPrice"
      | "setRechargePrice"
      | "supportsInterface"
      | "symbol"
      | "tokenByIndex"
      | "tokenOfOwnerByIndex"
      | "tokenURI"
      | "totalSupply"
      | "transferFrom"
      | "transferOwnership"
      | "unequipArtifact"
      | "useSpecialEffect"
      | "withdraw"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "Approval"
      | "ApprovalForAll"
      | "ArtifactCrafted"
      | "ArtifactEquipped"
      | "ArtifactRecharged"
      | "ArtifactUnequipped"
      | "OwnershipTransferred"
      | "SpecialEffectTriggered"
      | "Transfer"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "approve",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "artifacts",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "balanceOf",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "craft", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "craftPrice",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "equipArtifact",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getApproved",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getArtifact",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getOwnerArtifacts",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isApprovedForAll",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "ownerArtifacts",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "ownerOf",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "rechargeArtifact",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "rechargePrice",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "safeTransferFrom(address,address,uint256)",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "safeTransferFrom(address,address,uint256,bytes)",
    values: [AddressLike, AddressLike, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setApprovalForAll",
    values: [AddressLike, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "setCraftPrice",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setRechargePrice",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "tokenByIndex",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "tokenOfOwnerByIndex",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "tokenURI",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferFrom",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "unequipArtifact",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "useSpecialEffect",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "withdraw", values?: undefined): string;

  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "artifacts", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "craft", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "craftPrice", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "equipArtifact",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getApproved",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getArtifact",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getOwnerArtifacts",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isApprovedForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "ownerArtifacts",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "ownerOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "rechargeArtifact",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rechargePrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "safeTransferFrom(address,address,uint256)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "safeTransferFrom(address,address,uint256,bytes)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setApprovalForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setCraftPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setRechargePrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "tokenByIndex",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tokenOfOwnerByIndex",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "tokenURI", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "unequipArtifact",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "useSpecialEffect",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
}

export namespace ApprovalEvent {
  export type InputTuple = [
    owner: AddressLike,
    approved: AddressLike,
    tokenId: BigNumberish
  ];
  export type OutputTuple = [owner: string, approved: string, tokenId: bigint];
  export interface OutputObject {
    owner: string;
    approved: string;
    tokenId: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ApprovalForAllEvent {
  export type InputTuple = [
    owner: AddressLike,
    operator: AddressLike,
    approved: boolean
  ];
  export type OutputTuple = [
    owner: string,
    operator: string,
    approved: boolean
  ];
  export interface OutputObject {
    owner: string;
    operator: string;
    approved: boolean;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ArtifactCraftedEvent {
  export type InputTuple = [
    tokenId: BigNumberish,
    owner: AddressLike,
    artifactType: BigNumberish,
    rarity: BigNumberish
  ];
  export type OutputTuple = [
    tokenId: bigint,
    owner: string,
    artifactType: bigint,
    rarity: bigint
  ];
  export interface OutputObject {
    tokenId: bigint;
    owner: string;
    artifactType: bigint;
    rarity: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ArtifactEquippedEvent {
  export type InputTuple = [tokenId: BigNumberish, monanimalId: BigNumberish];
  export type OutputTuple = [tokenId: bigint, monanimalId: bigint];
  export interface OutputObject {
    tokenId: bigint;
    monanimalId: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ArtifactRechargedEvent {
  export type InputTuple = [tokenId: BigNumberish, newCharges: BigNumberish];
  export type OutputTuple = [tokenId: bigint, newCharges: bigint];
  export interface OutputObject {
    tokenId: bigint;
    newCharges: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ArtifactUnequippedEvent {
  export type InputTuple = [tokenId: BigNumberish];
  export type OutputTuple = [tokenId: bigint];
  export interface OutputObject {
    tokenId: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [previousOwner: string, newOwner: string];
  export interface OutputObject {
    previousOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace SpecialEffectTriggeredEvent {
  export type InputTuple = [
    tokenId: BigNumberish,
    effect: BigNumberish,
    power: BigNumberish
  ];
  export type OutputTuple = [tokenId: bigint, effect: bigint, power: bigint];
  export interface OutputObject {
    tokenId: bigint;
    effect: bigint;
    power: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace TransferEvent {
  export type InputTuple = [
    from: AddressLike,
    to: AddressLike,
    tokenId: BigNumberish
  ];
  export type OutputTuple = [from: string, to: string, tokenId: bigint];
  export interface OutputObject {
    from: string;
    to: string;
    tokenId: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface ArtifactNFT extends BaseContract {
  connect(runner?: ContractRunner | null): ArtifactNFT;
  waitForDeployment(): Promise<this>;

  interface: ArtifactNFTInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  approve: TypedContractMethod<
    [to: AddressLike, tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;

  artifacts: TypedContractMethod<
    [arg0: BigNumberish],
    [
      [
        string,
        bigint,
        bigint,
        ArtifactNFT.ArtifactStatsStructOutput,
        bigint,
        bigint,
        string,
        boolean,
        bigint,
        bigint,
        bigint
      ] & {
        name: string;
        artifactType: bigint;
        rarity: bigint;
        stats: ArtifactNFT.ArtifactStatsStructOutput;
        specialEffect: bigint;
        effectPower: bigint;
        essence: string;
        isEquipped: boolean;
        equippedTo: bigint;
        charges: bigint;
        maxCharges: bigint;
      }
    ],
    "view"
  >;

  balanceOf: TypedContractMethod<[owner: AddressLike], [bigint], "view">;

  craft: TypedContractMethod<[], [void], "payable">;

  craftPrice: TypedContractMethod<[], [bigint], "view">;

  equipArtifact: TypedContractMethod<
    [tokenId: BigNumberish, monanimalId: BigNumberish],
    [void],
    "nonpayable"
  >;

  getApproved: TypedContractMethod<[tokenId: BigNumberish], [string], "view">;

  getArtifact: TypedContractMethod<
    [tokenId: BigNumberish],
    [ArtifactNFT.ArtifactStructOutput],
    "view"
  >;

  getOwnerArtifacts: TypedContractMethod<
    [owner: AddressLike],
    [bigint[]],
    "view"
  >;

  isApprovedForAll: TypedContractMethod<
    [owner: AddressLike, operator: AddressLike],
    [boolean],
    "view"
  >;

  name: TypedContractMethod<[], [string], "view">;

  owner: TypedContractMethod<[], [string], "view">;

  ownerArtifacts: TypedContractMethod<
    [arg0: AddressLike, arg1: BigNumberish],
    [bigint],
    "view"
  >;

  ownerOf: TypedContractMethod<[tokenId: BigNumberish], [string], "view">;

  rechargeArtifact: TypedContractMethod<
    [tokenId: BigNumberish],
    [void],
    "payable"
  >;

  rechargePrice: TypedContractMethod<[], [bigint], "view">;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  "safeTransferFrom(address,address,uint256)": TypedContractMethod<
    [from: AddressLike, to: AddressLike, tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;

  "safeTransferFrom(address,address,uint256,bytes)": TypedContractMethod<
    [
      from: AddressLike,
      to: AddressLike,
      tokenId: BigNumberish,
      data: BytesLike
    ],
    [void],
    "nonpayable"
  >;

  setApprovalForAll: TypedContractMethod<
    [operator: AddressLike, approved: boolean],
    [void],
    "nonpayable"
  >;

  setCraftPrice: TypedContractMethod<
    [_price: BigNumberish],
    [void],
    "nonpayable"
  >;

  setRechargePrice: TypedContractMethod<
    [_price: BigNumberish],
    [void],
    "nonpayable"
  >;

  supportsInterface: TypedContractMethod<
    [interfaceId: BytesLike],
    [boolean],
    "view"
  >;

  symbol: TypedContractMethod<[], [string], "view">;

  tokenByIndex: TypedContractMethod<[index: BigNumberish], [bigint], "view">;

  tokenOfOwnerByIndex: TypedContractMethod<
    [owner: AddressLike, index: BigNumberish],
    [bigint],
    "view"
  >;

  tokenURI: TypedContractMethod<[tokenId: BigNumberish], [string], "view">;

  totalSupply: TypedContractMethod<[], [bigint], "view">;

  transferFrom: TypedContractMethod<
    [from: AddressLike, to: AddressLike, tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  unequipArtifact: TypedContractMethod<
    [tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;

  useSpecialEffect: TypedContractMethod<
    [tokenId: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  withdraw: TypedContractMethod<[], [void], "nonpayable">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "approve"
  ): TypedContractMethod<
    [to: AddressLike, tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "artifacts"
  ): TypedContractMethod<
    [arg0: BigNumberish],
    [
      [
        string,
        bigint,
        bigint,
        ArtifactNFT.ArtifactStatsStructOutput,
        bigint,
        bigint,
        string,
        boolean,
        bigint,
        bigint,
        bigint
      ] & {
        name: string;
        artifactType: bigint;
        rarity: bigint;
        stats: ArtifactNFT.ArtifactStatsStructOutput;
        specialEffect: bigint;
        effectPower: bigint;
        essence: string;
        isEquipped: boolean;
        equippedTo: bigint;
        charges: bigint;
        maxCharges: bigint;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "balanceOf"
  ): TypedContractMethod<[owner: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "craft"
  ): TypedContractMethod<[], [void], "payable">;
  getFunction(
    nameOrSignature: "craftPrice"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "equipArtifact"
  ): TypedContractMethod<
    [tokenId: BigNumberish, monanimalId: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "getApproved"
  ): TypedContractMethod<[tokenId: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "getArtifact"
  ): TypedContractMethod<
    [tokenId: BigNumberish],
    [ArtifactNFT.ArtifactStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "getOwnerArtifacts"
  ): TypedContractMethod<[owner: AddressLike], [bigint[]], "view">;
  getFunction(
    nameOrSignature: "isApprovedForAll"
  ): TypedContractMethod<
    [owner: AddressLike, operator: AddressLike],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "name"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "ownerArtifacts"
  ): TypedContractMethod<
    [arg0: AddressLike, arg1: BigNumberish],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "ownerOf"
  ): TypedContractMethod<[tokenId: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "rechargeArtifact"
  ): TypedContractMethod<[tokenId: BigNumberish], [void], "payable">;
  getFunction(
    nameOrSignature: "rechargePrice"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "safeTransferFrom(address,address,uint256)"
  ): TypedContractMethod<
    [from: AddressLike, to: AddressLike, tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "safeTransferFrom(address,address,uint256,bytes)"
  ): TypedContractMethod<
    [
      from: AddressLike,
      to: AddressLike,
      tokenId: BigNumberish,
      data: BytesLike
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setApprovalForAll"
  ): TypedContractMethod<
    [operator: AddressLike, approved: boolean],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setCraftPrice"
  ): TypedContractMethod<[_price: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setRechargePrice"
  ): TypedContractMethod<[_price: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "supportsInterface"
  ): TypedContractMethod<[interfaceId: BytesLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "symbol"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "tokenByIndex"
  ): TypedContractMethod<[index: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "tokenOfOwnerByIndex"
  ): TypedContractMethod<
    [owner: AddressLike, index: BigNumberish],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "tokenURI"
  ): TypedContractMethod<[tokenId: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "totalSupply"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "transferFrom"
  ): TypedContractMethod<
    [from: AddressLike, to: AddressLike, tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "unequipArtifact"
  ): TypedContractMethod<[tokenId: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "useSpecialEffect"
  ): TypedContractMethod<[tokenId: BigNumberish], [boolean], "nonpayable">;
  getFunction(
    nameOrSignature: "withdraw"
  ): TypedContractMethod<[], [void], "nonpayable">;

  getEvent(
    key: "Approval"
  ): TypedContractEvent<
    ApprovalEvent.InputTuple,
    ApprovalEvent.OutputTuple,
    ApprovalEvent.OutputObject
  >;
  getEvent(
    key: "ApprovalForAll"
  ): TypedContractEvent<
    ApprovalForAllEvent.InputTuple,
    ApprovalForAllEvent.OutputTuple,
    ApprovalForAllEvent.OutputObject
  >;
  getEvent(
    key: "ArtifactCrafted"
  ): TypedContractEvent<
    ArtifactCraftedEvent.InputTuple,
    ArtifactCraftedEvent.OutputTuple,
    ArtifactCraftedEvent.OutputObject
  >;
  getEvent(
    key: "ArtifactEquipped"
  ): TypedContractEvent<
    ArtifactEquippedEvent.InputTuple,
    ArtifactEquippedEvent.OutputTuple,
    ArtifactEquippedEvent.OutputObject
  >;
  getEvent(
    key: "ArtifactRecharged"
  ): TypedContractEvent<
    ArtifactRechargedEvent.InputTuple,
    ArtifactRechargedEvent.OutputTuple,
    ArtifactRechargedEvent.OutputObject
  >;
  getEvent(
    key: "ArtifactUnequipped"
  ): TypedContractEvent<
    ArtifactUnequippedEvent.InputTuple,
    ArtifactUnequippedEvent.OutputTuple,
    ArtifactUnequippedEvent.OutputObject
  >;
  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;
  getEvent(
    key: "SpecialEffectTriggered"
  ): TypedContractEvent<
    SpecialEffectTriggeredEvent.InputTuple,
    SpecialEffectTriggeredEvent.OutputTuple,
    SpecialEffectTriggeredEvent.OutputObject
  >;
  getEvent(
    key: "Transfer"
  ): TypedContractEvent<
    TransferEvent.InputTuple,
    TransferEvent.OutputTuple,
    TransferEvent.OutputObject
  >;

  filters: {
    "Approval(address,address,uint256)": TypedContractEvent<
      ApprovalEvent.InputTuple,
      ApprovalEvent.OutputTuple,
      ApprovalEvent.OutputObject
    >;
    Approval: TypedContractEvent<
      ApprovalEvent.InputTuple,
      ApprovalEvent.OutputTuple,
      ApprovalEvent.OutputObject
    >;

    "ApprovalForAll(address,address,bool)": TypedContractEvent<
      ApprovalForAllEvent.InputTuple,
      ApprovalForAllEvent.OutputTuple,
      ApprovalForAllEvent.OutputObject
    >;
    ApprovalForAll: TypedContractEvent<
      ApprovalForAllEvent.InputTuple,
      ApprovalForAllEvent.OutputTuple,
      ApprovalForAllEvent.OutputObject
    >;

    "ArtifactCrafted(uint256,address,uint8,uint8)": TypedContractEvent<
      ArtifactCraftedEvent.InputTuple,
      ArtifactCraftedEvent.OutputTuple,
      ArtifactCraftedEvent.OutputObject
    >;
    ArtifactCrafted: TypedContractEvent<
      ArtifactCraftedEvent.InputTuple,
      ArtifactCraftedEvent.OutputTuple,
      ArtifactCraftedEvent.OutputObject
    >;

    "ArtifactEquipped(uint256,uint256)": TypedContractEvent<
      ArtifactEquippedEvent.InputTuple,
      ArtifactEquippedEvent.OutputTuple,
      ArtifactEquippedEvent.OutputObject
    >;
    ArtifactEquipped: TypedContractEvent<
      ArtifactEquippedEvent.InputTuple,
      ArtifactEquippedEvent.OutputTuple,
      ArtifactEquippedEvent.OutputObject
    >;

    "ArtifactRecharged(uint256,uint256)": TypedContractEvent<
      ArtifactRechargedEvent.InputTuple,
      ArtifactRechargedEvent.OutputTuple,
      ArtifactRechargedEvent.OutputObject
    >;
    ArtifactRecharged: TypedContractEvent<
      ArtifactRechargedEvent.InputTuple,
      ArtifactRechargedEvent.OutputTuple,
      ArtifactRechargedEvent.OutputObject
    >;

    "ArtifactUnequipped(uint256)": TypedContractEvent<
      ArtifactUnequippedEvent.InputTuple,
      ArtifactUnequippedEvent.OutputTuple,
      ArtifactUnequippedEvent.OutputObject
    >;
    ArtifactUnequipped: TypedContractEvent<
      ArtifactUnequippedEvent.InputTuple,
      ArtifactUnequippedEvent.OutputTuple,
      ArtifactUnequippedEvent.OutputObject
    >;

    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;

    "SpecialEffectTriggered(uint256,uint8,uint256)": TypedContractEvent<
      SpecialEffectTriggeredEvent.InputTuple,
      SpecialEffectTriggeredEvent.OutputTuple,
      SpecialEffectTriggeredEvent.OutputObject
    >;
    SpecialEffectTriggered: TypedContractEvent<
      SpecialEffectTriggeredEvent.InputTuple,
      SpecialEffectTriggeredEvent.OutputTuple,
      SpecialEffectTriggeredEvent.OutputObject
    >;

    "Transfer(address,address,uint256)": TypedContractEvent<
      TransferEvent.InputTuple,
      TransferEvent.OutputTuple,
      TransferEvent.OutputObject
    >;
    Transfer: TypedContractEvent<
      TransferEvent.InputTuple,
      TransferEvent.OutputTuple,
      TransferEvent.OutputObject
    >;
  };
}
