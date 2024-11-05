class projCal:
    def __init__(self) -> None:
        # tracking
        self.Asking = 0 #此为输入参数
        self.LandSize = 0
        self.Decision = ""
        self.ActualOffer = 0
        self.SoldPrice = 0
        self.remodel = 0
        self.ARV_TMI = 0
        self.ARV_AGENT = 0
        self.AcqCostAsking = 0
        self.ConstructionCost = 0
        self.PermitCost = 0
        self.DesginCost = 0
        self.OtherCost = 0
        self.DesignPermitMonth = 0
        self.ConstructionMonth = 0
        self.AcqLoanRate = 0.8 #此为输入参数
        self.AcqLoanInterestRate = 0.0
        self.AcqPoint = 0.025 
        self.ConsLoanRate = 0.0
        self.ConsLoanInterest = 0.0
        self.ConsPoint = 0.0
        self.PropertyTaxRate = 0.012
        self.ClosingCost = 0.01
        self.ProjProfix = 0.0
        self.PMConsRate = 0.10
        self.AgentCom = 0.05
        self.AcqInvest = 0.0
        self.Forecast = 3200 #此为输入参数
        pass
    
    def setScenarios(self,sceNum):
        if sceNum >1 or sceNum <-1:
            raise ValueError("sceNum must be -1, 0 and 1")
        self.scenarioNum = sceNum

    def grossProfit(self):
        return 0
        
    def netProfit(self):
        return 0

    def calROI(self):
        return 0

    def calIRR(self):
        return 0

    def calTotalCost(self):
        return 0
    
    def TotalInterest(self):
        return 0

    def newROI(self):
        return 0

    def dict_to_obj(self,data: dict): 
        self.Forecast = data['Forecast']
        self.Asking = data['Asking']
        self.PermitCost = data['PermitCost']
        self.DesginCost = data['DesginCost']
        self.OtherCost = data['OtherCost']
        self.AcqLoanRate = data['AcqLoanRate']
        self.AcqLoanInterestRate = data['AcqLoanInterestRate']
        self.DesignPermitMonth = data['DesignPermitMonth']
        self.ConstructionMonth = data['ConstructionMonth']
        self.ConsLoanRate = data['ConsLoanRate']
        self.ConsLoanInterest = data['ConsLoanInterest']
        self.AcqPoint = data['AcqPoint']
        self.ConsPoint = data['ConsPoint']
        self.remodel = data['remodel']
    
    def askingVal(self, askingVal):
        self.Asking = askingVal

    def getResult(self):
        results = {}
        results["TotalCost"]=self.calTotalCost()
        results["TotalInterest"]=self.TotalInterest()
        results["GrossProfit"]=self.grossProfit()
        results["NetProfit"]=self.netProfit()
        results["ROI"]=self.calROI()
        results["IRR"]=self.calIRR()
        # print(results)
        return results

def main():
    # Create an instance of projCal
    project = projCal()
    # Set attributes
    project.dict_to_obj({'Forecast': 3200000, 'Asking': 1850000, 'PermitCost': 7, 'DesginCost': 18, 'OtherCost': 0, 'AcqLoanRate': 0.8, 'AcqLoanInterestRate': 0.1, 'DesignPermitMonth': 7, 'ConstructionMonth': 5, 'ConsLoanRate': 1, 'ConsLoanInterest': 0.1, 'AcqPoint': 0.025, 'ConsPoint': 0.025, 'remodel': 300000})

    print(project.getResult())

if __name__ == "__main__":
     main()
