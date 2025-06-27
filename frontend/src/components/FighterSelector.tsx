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
      <div className="bg-gradient-to-br from-[#0E100F] via-[#200052] to-[#0E100F] border border-[#836EF9]/30 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#836EF9]/20">
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
        <div className="p-6 max-h-[60vh] overflow-y-auto">
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
        <div className="flex items-center justify-between p-6 border-t border-[#836EF9]/20 bg-black/20">
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
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={onConfirm}
              disabled={!selectedFighter || isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Starting Battle...
                </>
              ) : (
                'Start Battle'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FighterSelector