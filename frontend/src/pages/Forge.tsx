import React from 'react'

import { useWallet } from '../hooks/useWallet'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'


const Forge: React.FC = () => {
    const { isConnected } = useWallet()

    if (!isConnected) {
        return (
            <div className="container-fluid py-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 text-center">
                        <div className="card bg-dark text-white">
                            <div className="card-body py-5">
                                <i className="fas fa-wallet fa-3x text-muted mb-4"></i>
                                <h3 className="mb-3">Wallet Not Connected</h3>
                                <p className="text-muted mb-4">
                                    Please connect your wallet to access the Forge
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    {/* Header */}
                    <div className="text-center mb-5">
                        <h1 className="text-white mb-3">
                            <i className="fas fa-hammer me-3 text-warning"></i>
                            The Forge
                        </h1>
                        <p className="text-muted lead">
                            Craft powerful weapons and artifacts for your Monanimals
                        </p>
                    </div>

                    {/* Coming Soon */}
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="card bg-dark text-white">
                                <div className="card-body text-center py-5">
                                    <i className="fas fa-tools fa-4x text-warning mb-4"></i>
                                    <h3 className="mb-3">Forge Coming Soon</h3>
                                    <p className="text-muted mb-4">
                                        The forge is currently under construction. Soon you'll be able to:
                                    </p>

                                    <div className="row mb-4">
                                        <div className="col-md-4 mb-3">
                                            <div className="card bg-secondary h-100">
                                                <div className="card-body text-center">
                                                    <i className="fas fa-sword fa-2x text-danger mb-3"></i>
                                                    <h5 className="card-title">Craft Weapons</h5>
                                                    <p className="card-text small text-muted">
                                                        Forge powerful weapons to boost your Monanimals' attack power
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <div className="card bg-secondary h-100">
                                                <div className="card-body text-center">
                                                    <i className="fas fa-gem fa-2x text-info mb-3"></i>
                                                    <h5 className="card-title">Create Artifacts</h5>
                                                    <p className="card-text small text-muted">
                                                        Craft magical artifacts with special abilities and effects
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <div className="card bg-secondary h-100">
                                                <div className="card-body text-center">
                                                    <i className="fas fa-cog fa-2x text-success mb-3"></i>
                                                    <h5 className="card-title">Upgrade Equipment</h5>
                                                    <p className="card-text small text-muted">
                                                        Enhance existing weapons and artifacts to make them stronger
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Badge variant="warning" className="mb-3">
                                        <i className="fas fa-clock me-2"></i>
                                        Under Development
                                    </Badge>

                                    <div className="mt-4">
                                        <Button variant="outline" disabled>
                                            <i className="fas fa-hammer me-2"></i>
                                            Forge (Coming Soon)
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Forge