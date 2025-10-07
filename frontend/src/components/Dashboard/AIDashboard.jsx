import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Brain,
  TrendingUp,
  FileText,
  Zap,
  Plane,
  BarChart3,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Wrench,
  Target,
  Lightbulb
} from 'lucide-react';

const AIDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [aiInsights, setAiInsights] = useState([]);
  const [nlpQuery, setNlpQuery] = useState('');
  const [nlpResponse, setNlpResponse] = useState('');
  const [selectedDocumentType, setSelectedDocumentType] = useState('invoice');
  const [budgetPredictions, setBudgetPredictions] = useState(null);
  const [cashFlowForecast, setCashFlowForecast] = useState(null);
  const [vendorScores, setVendorScores] = useState(null);
  const [maintenancePredictions, setMaintenancePredictions] = useState(null);

  // Fetch AI dashboard summary on component mount
  useEffect(() => {
    fetchAIDashboardSummary();
    fetchAIInsights();
  }, []);

  const fetchAIDashboardSummary = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/ai/ai-dashboard-summary');
      const data = await response.json();

      if (data.status === 'success') {
        setDashboardData(data.summary);
      }
    } catch (error) {
      console.error('Error fetching AI dashboard summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAIInsights = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/ai/ai-insights?limit=10');
      const data = await response.json();

      if (data.status === 'success') {
        setAiInsights(data.insights);
      }
    } catch (error) {
      console.error('Error fetching AI insights:', error);
    }
  };

  const handleNLPQuery = async () => {
    if (!nlpQuery.trim()) return;

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/ai/natural-language-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: nlpQuery }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setNlpResponse(data.data.response || data.data.message);
      }
    } catch (error) {
      console.error('Error processing NLP query:', error);
      setNlpResponse('Error processing your query. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgetPredictions = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/ai/predict-budget-variance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ months_ahead: 3 }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setBudgetPredictions(data.data);
      }
    } catch (error) {
      console.error('Error fetching budget predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCashFlowForecast = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/ai/forecast-cash-flow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ days_ahead: 30 }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setCashFlowForecast(data.data);
      }
    } catch (error) {
      console.error('Error fetching cash flow forecast:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorScores = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/ai/score-vendor-reliability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setVendorScores(data.data);
      }
    } catch (error) {
      console.error('Error fetching vendor scores:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMaintenancePredictions = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/ai/predict-asset-maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ asset_type: 'vehicle' }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setMaintenancePredictions(data.data);
      }
    } catch (error) {
      console.error('Error fetching maintenance predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'HIGH': return 'destructive';
      case 'MEDIUM': return 'default';
      case 'LOW': return 'secondary';
      default: return 'outline';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">AI Intelligence Dashboard</h1>
            <p className="text-muted-foreground">
              Advanced AI-powered insights and automation for your business
            </p>
          </div>
        </div>
        <Button onClick={fetchAIDashboardSummary} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="predictive">Predictive</TabsTrigger>
          <TabsTrigger value="conversational">AI Chat</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="travel">Travel</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {dashboardData && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Budget Alerts</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardData.predictive_analytics?.budget_alerts || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Active budget variance alerts
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cash Flow Alerts</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardData.predictive_analytics?.cash_flow_alerts || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Cash flow warnings
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Automation Triggers</CardTitle>
                  <Zap className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardData.automation_status?.triggers_executed || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Executed this cycle
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {aiInsights.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Generated insights
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent AI Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiInsights.slice(0, 5).map((insight, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {insight.type === 'budget_alert' && <DollarSign className="h-4 w-4 text-green-600" />}
                      {insight.type === 'maintenance_alert' && <Wrench className="h-4 w-4 text-blue-600" />}
                      {insight.type === 'vendor_insight' && <Users className="h-4 w-4 text-purple-600" />}
                      {insight.type === 'cash_flow_alert' && <TrendingUp className="h-4 w-4 text-orange-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{insight.title || insight.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(insight.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    fetchBudgetPredictions();
                    setActiveTab('predictive');
                  }}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Budget Predictions
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    fetchCashFlowForecast();
                    setActiveTab('predictive');
                  }}
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Check Cash Flow Forecast
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    fetchVendorScores();
                    setActiveTab('predictive');
                  }}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Review Vendor Scores
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    fetchMaintenancePredictions();
                    setActiveTab('predictive');
                  }}
                >
                  <Wrench className="mr-2 h-4 w-4" />
                  Check Maintenance Predictions
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Predictive Analytics Tab */}
        <TabsContent value="predictive" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget Variance Predictions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={fetchBudgetPredictions} disabled={loading}>
                  Generate Budget Predictions
                </Button>
                {budgetPredictions && budgetPredictions.success && (
                  <div className="space-y-3">
                    {budgetPredictions.predictions.map((pred, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{pred.period}</span>
                          <Badge variant={getStatusColor(pred.expected_variance > 10000 ? 'HIGH' : 'MEDIUM')}>
                            {formatCurrency(pred.predicted_amount)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Variance: {formatCurrency(pred.expected_variance)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cash Flow Forecast</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={fetchCashFlowForecast} disabled={loading}>
                  Generate Cash Flow Forecast
                </Button>
                {cashFlowForecast && cashFlowForecast.success && (
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium">Average Daily Inflow</p>
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(cashFlowForecast.summary?.avg_daily_inflow || 0)}
                      </p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <p className="text-sm font-medium">Average Daily Outflow</p>
                      <p className="text-lg font-bold text-red-600">
                        {formatCurrency(cashFlowForecast.summary?.avg_daily_outflow || 0)}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vendor Reliability Scores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={fetchVendorScores} disabled={loading}>
                  Generate Vendor Scores
                </Button>
                {vendorScores && vendorScores.success && (
                  <div className="space-y-3">
                    {vendorScores.scores.slice(0, 5).map((vendor, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{vendor.vendor}</span>
                          <Badge variant={vendor.reliability_score > 80 ? 'default' : 'destructive'}>
                            {vendor.reliability_score}/100
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {vendor.recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Asset Maintenance Predictions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={fetchMaintenancePredictions} disabled={loading}>
                  Generate Maintenance Predictions
                </Button>
                {maintenancePredictions && maintenancePredictions.success && (
                  <div className="space-y-3">
                    {maintenancePredictions.predictions.slice(0, 5).map((pred, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{pred.asset_name}</span>
                          <Badge variant={getStatusColor(pred.priority)}>
                            {pred.days_until_maintenance} days
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Confidence: {pred.confidence}%
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Conversational AI Tab */}
        <TabsContent value="conversational" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Natural Language AI Assistant</CardTitle>
              <p className="text-sm text-muted-foreground">
                Ask questions in plain English about your business data
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Ask me anything about your business data..."
                    value={nlpQuery}
                    onChange={(e) => setNlpQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleNLPQuery()}
                  />
                  <Button onClick={handleNLPQuery} disabled={loading || !nlpQuery.trim()}>
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>

                {nlpResponse && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm">{nlpResponse}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Sample Questions:</h4>
                  <div className="space-y-2">
                    {[
                      "Show me budget variance for next month",
                      "How is our cash flow looking?",
                      "Which vendors are most reliable?",
                      "When do vehicles need maintenance?"
                    ].map((question, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-left"
                        onClick={() => setNlpQuery(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">AI Capabilities:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Budget analysis and forecasting</li>
                    <li>• Cash flow predictions</li>
                    <li>• Vendor performance scoring</li>
                    <li>• Maintenance scheduling</li>
                    <li>• Expense pattern analysis</li>
                    <li>• Business insights generation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Document Processing Tab */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Intelligent Document Processing</CardTitle>
              <p className="text-sm text-muted-foreground">
                Upload and process documents with AI-powered data extraction
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Document Type</label>
                    <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="invoice">Invoice</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="receipt">Receipt</SelectItem>
                        <SelectItem value="maintenance_record">Maintenance Record</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">File Upload</label>
                    <Input type="file" accept=".pdf,.docx,.jpg,.png" />
                  </div>

                  <Button className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Process Document
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Supported Formats:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• PDF documents</li>
                      <li>• Word documents (.docx)</li>
                      <li>• Images (.jpg, .png)</li>
                      <li>• Scanned documents</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium">AI Extraction:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Invoice numbers and amounts</li>
                      <li>• Contract terms and parties</li>
                      <li>• Receipt details</li>
                      <li>• Maintenance records</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Automation Tab */}
        <TabsContent value="automation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Smart Automation Triggers</CardTitle>
              <p className="text-sm text-muted-foreground">
                AI-powered workflow automation and intelligent alerts
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium">Budget Monitoring</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Automatically alert when spending exceeds thresholds
                  </p>
                  <Button size="sm" variant="outline">
                    Configure
                  </Button>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium">Vendor Performance</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Monitor vendor reliability and performance metrics
                  </p>
                  <Button size="sm" variant="outline">
                    Configure
                  </Button>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Wrench className="h-5 w-5 text-orange-600" />
                    <h4 className="font-medium">Maintenance Alerts</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Predictive maintenance scheduling and alerts
                  </p>
                  <Button size="sm" variant="outline">
                    Configure
                  </Button>
                </Card>
              </div>

              <Alert>
                <Zap className="h-4 w-4" />
                <AlertDescription>
                  Automation triggers are checked every hour. Configure triggers based on your business needs
                  for optimal workflow automation.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Travel Tab */}
        <TabsContent value="travel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Travel Planning Assistant</CardTitle>
              <p className="text-sm text-muted-foreground">
                Intelligent travel suggestions and budget optimization
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Destination</label>
                    <Input placeholder="Enter destination city" />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-sm font-medium">Start Date</label>
                      <Input type="date" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">End Date</label>
                      <Input type="date" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Budget (₹)</label>
                    <Input type="number" placeholder="Enter budget amount" />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Purpose</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select travel purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="conference">Conference</SelectItem>
                        <SelectItem value="training">Training</SelectItem>
                        <SelectItem value="client_visit">Client Visit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full">
                    <Plane className="mr-2 h-4 w-4" />
                    Generate Travel Plan
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">AI Features:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Intelligent itinerary planning</li>
                      <li>• Budget optimization</li>
                      <li>• Cost estimation</li>
                      <li>• Alternative suggestions</li>
                      <li>• Calendar integration</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Sample Output:</h4>
                    <div className="text-sm text-green-800">
                      <p><strong>Day 1:</strong> Business meetings</p>
                      <p><strong>Day 2:</strong> Client visits</p>
                      <p><strong>Day 3:</strong> Networking dinner</p>
                      <p className="mt-2"><strong>Total Cost:</strong> ₹45,000</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Business Insights</CardTitle>
              <p className="text-sm text-muted-foreground">
                Comprehensive analysis and recommendations from historical data
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <BarChart3 className="h-6 w-6 mb-2" />
                  Transaction Patterns
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Wrench className="h-6 w-6 mb-2" />
                  Maintenance Trends
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Users className="h-6 w-6 mb-2" />
                  Vendor Analysis
                </Button>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Recent Insights:</h4>
                {aiInsights.map((insight, index) => (
                  <Alert key={index}>
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{insight.title || insight.type}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {insight.data?.message || 'AI-generated insight based on data analysis'}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {new Date(insight.created_at).toLocaleDateString()}
                        </Badge>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIDashboard;