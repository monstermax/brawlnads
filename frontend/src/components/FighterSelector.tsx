import React from 'react'
import { Button } from './ui/button'
import MonanimalCard from './MonanimalCard'
import type { FighterSelectorProps } from '../types'

const FighterSelector: React.FC<FighterSelectorProps> = ({
  monanimals,
  selectedFighter,
  onSelectFighter,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      tabIndex={-1}
    >
      <div className="bg-gradient-to-br from-[#0E100F] via-[#200052] to-[#0E100F] border border-[#836EF9]/30 rounded-xl shadow-2xl w-full max-w-6xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#836EF9]/20">
          <h2 className="gaming-title text-2xl">Select Your Fighter</h2>
          <button
            type="button"
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            onClick={onClose}
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 flex-1 overflow-y-auto">
          {monanimals.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400">
                <svg className="w-16 h-16 mx-auto mb-4 text-[#A0055D]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <h3 className="text-xl font-bold text-white mb-2">No Monanimals found in your collection</h3>
                <p className="text-gray-400">You need to own at least one Monanimal to participate in battles</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {monanimals.map((monanimal) => (
                <div key={monanimal.id} className="relative">
                  <MonanimalCard
                    monanimal={monanimal}
                    onSelect={monanimal.isKO ? undefined : onSelectFighter}
                    isSelected={selectedFighter?.id === monanimal.id}
                    showActions={false}
                    disableImageModal={true}
                  />
                  {monanimal.isKO && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-xl pointer-events-none">
                      <div className="bg-black/90 px-4 py-2 rounded-lg border border-red-500/30">
                        <span className="text-red-400 text-sm font-medium">
                          <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                          </svg>
                          Cannot fight (KO)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-[#836EF9]/20 bg-black/20 flex-shrink-0">
          <div className="text-gray-400">
            {selectedFighter ? (
              <span>
                Selected: <span className="text-white font-bold">{selectedFighter.name}</span>
              </span>
            ) : (
              <span>Please select a fighter to continue</span>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              className="flex items-center gap-2 px-6 py-3 bg-gray-800/80 hover:bg-gray-700/80 text-gray-300 hover:text-white font-bold rounded-lg border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300 uppercase tracking-wider"
              onClick={onClose}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              BACK
            </button>
            <button
              className={`flex items-center gap-2 px-6 py-3 font-bold rounded-lg transition-all duration-300 uppercase tracking-wider ${
                !selectedFighter || isLoading
                  ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed border border-gray-600/30'
                  : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white border border-red-500/50 hover:border-red-400/50 hover:scale-105 shadow-lg hover:shadow-red-500/25'
              }`}
              onClick={onConfirm}
              disabled={!selectedFighter || isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  STARTING...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  CHOOSE OPPONENT
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FighterSelector