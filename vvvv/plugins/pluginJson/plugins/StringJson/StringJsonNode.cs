#region usings
using System;
using System.ComponentModel.Composition;

using VVVV.PluginInterfaces.V1;
using VVVV.PluginInterfaces.V2;
using VVVV.Utils.VColor;
using VVVV.Utils.VMath;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;


using VVVV.Core.Logging;
using System.Collections.Generic;

#endregion usings

namespace VVVV.Nodes
{

	[PluginInfo(Name = "JsonParser", Category = "JSON", Help = "parse json string", Tags = "")]
	public class JsonParser : IPluginEvaluate
	{
		#region fields & pins
		[Input("JSON", DefaultString = "hello")]
		IDiffSpread<string> FInput;

		

		
	
		
		
	    [Output("Output json")]
		ISpread<JObject> FJOutput;
		
		
		
		
	
		[Import()]
		ILogger FLogger;
		#endregion fields & pins
		//called when data for any output pin is requested
		
        
		
		public void Evaluate(int SpreadMax)
		{
		 
	
	if(FInput.IsChanged )
	
	       
    
           FJOutput[0] = JObject.Parse(FInput[0]);
	       FJOutput.SliceCount = 1;
     
}

	}


	
	
	
    [PluginInfo(Name = "SelectToken", Category = "JSON", Help = "select json token", Tags = "")]
	public class SelectToken : IPluginEvaluate
	{
		#region fields & pins
		[Input("JObject")]
		ISpread<JObject> FInput;

	    [Input("path")]
		ISpread<string> FInputp;
		
	
		[Output("Output")]
		ISpread<string> FOutput;


		
		
	
		[Import()]
		ILogger FLogger;
		#endregion fields & pins
		//called when data for any output pin is requested
		
        
		
		public void Evaluate(int SpreadMax)
		{
		 
		  FOutput.SliceCount = SpreadMax;
		
		 
		  if( FInput[0]!=null){
		
		for (int i = 0; i < FInputp.SliceCount; i++)
          	
          	{
          		
           if( FInput[0].SelectToken(FInputp[i])!= null && FInput[0]!=null){
          	
           FOutput[i]=  FInput[0].SelectToken(FInputp[i]).ToString();
           
          	}else{FOutput[i]= "";}
           
           } 
		  
		
	
}

	}
}
	
	
	
	
	
	
    [PluginInfo(Name = "JsonArray", Category = "JSON", Help = "list json array content", Tags = "")]
	public class JsonArray : IPluginEvaluate
	{
		#region fields & pins
		[Input("Jobject")]
		ISpread<JObject> FInput;

	    [Input("path")]
		ISpread<string> FInputp;
		
	   [Input("key")]
		ISpread<string> FInputk;

		[Output("Output")]
		ISpread<string> FOutput;

        [Output("count")]
		ISpread<int> FcOutput;
		
	   // [Output("Output json")]
		//ISpread<Vson> FJOutput;
		
		
	
		[Import()]
		ILogger FLogger;
		#endregion fields & pins
		//called when data for any output pin is requested
		
        
		
		public void Evaluate(int SpreadMax)
		{
		 
           int i = 0;
			FcOutput.SliceCount = 1;
		   if( FInput[0]!=null){
           if( FInput[0].SelectToken(FInputp[i])!= null  ){
          		
          	var results  = FInput[0].SelectToken(FInputp[i]);
          	foreach (JToken child in results.Children())
            {
            if( child.SelectToken(FInputk[0])!= null ){
	        FOutput[i] = child.SelectToken(FInputk[0]).ToString();
	      } else { FOutput[i] = "";} 
            	
            	
            
              i++;
          
          	
           }

		  FOutput.SliceCount = i;
		  FcOutput[0] = i;
	}}else{
    FOutput.SliceCount = 1;
	FcOutput[0] = 0;	
	FOutput[i]= "";}
}
	
	
	
	}
	
	[PluginInfo(Name = "Spread2JSON", Category = "JSON", Help = "create Json Objects", Tags = "")]
	public class Spread2JSON : IPluginEvaluate
	{
		#region fields & pins
		[Input("Jobject")]
		ISpread<JObject> FInput;

	    [Input("path")]
		ISpread<string> FInputp;
		
	   [Input("key")]
		ISpread<string> FInputk;

		[Output("Output")]
		ISpread<JObject> FOutput;

        [Output("stringOut")]
		ISpread<string> FStringOut;
		
	   // [Output("Output json")]
		//ISpread<Vson> FJOutput;
		
		
	
		[Import()]
		ILogger FLogger;
		#endregion fields & pins
		//called when data for any output pin is requested
		
        
		
		public void Evaluate(int SpreadMax)
		{
			
			JObject json = new JObject();
			
		   	if( FInput[0]!=null)		
			{
				json = FInput[0];
			}
				
				for (int i = 0; i < FInputp.SliceCount; i++)				
				{					
					json.Add(FInputp[i], FInputk[i]);					
				}
	  
		  FOutput[0] = json;
			FStringOut[0] = json.ToString();
		
		}
	
	}
	
	
	
	[PluginInfo(Name = "join", Category = "JSON", Help = "join json objects", Tags = "")]
	public class JSONJoin : IPluginEvaluate, IPartImportsSatisfiedNotification
	{
		#region fields & pins
		
		
		public Spread<IIOContainer<ISpread<JObject>>> FInputs = new Spread<IIOContainer<ISpread<JObject>>>();
		
		[Config("Input Count", DefaultValue = 1, MinValue = 0)]
        public IDiffSpread<int> FInputCountIn;

	    [Input("root Name")]
		ISpread<string> FInputp;
		
	 
		[Output("Output")]
		ISpread<JObject> FOutput;

        [Output("stringOut")]
		ISpread<string> FStringOut;
		
		[Import]
        public IIOFactory FIOFactory;
		
	   // [Output("Output json")]
		//ISpread<Vson> FJOutput;
		
		
	
		[Import()]
		ILogger FLogger;
		#endregion fields & pins
		//called when data for any output pin is requested
		
		
		public void OnImportsSatisfied()
		{
			FInputCountIn.Changed += HandleInputCountChanged;
			
		}
		
		private void HandlePinCountChanged<T>(ISpread<int> countSpread, Spread<IIOContainer<T>> pinSpread, Func<int, IOAttribute> ioAttributeFactory) where T : class
		{
			pinSpread.ResizeAndDispose(
				countSpread[0], 
				(i) => 
				{
					var ioAttribute = ioAttributeFactory(i + 1);
					return FIOFactory.CreateIOContainer<T>(ioAttribute);
				}
			);
		}
		
		private void HandleInputCountChanged(IDiffSpread<int> sender)
		{
			HandlePinCountChanged(sender, FInputs, (i) => new InputAttribute(string.Format("Input {0}", i)));
		}
		
		
		
        
		
		public void Evaluate(int SpreadMax)
		{
			
			JObject json = new JObject();
			
		   	
				
				for (int i = 0; i < FInputs.SliceCount; i++)				
				{					
					json.Add(FInputp[i], FInputs[i].IOObject[0]);					
				}
	  
		  FOutput[0] = json;
			FStringOut[0] = json.ToString();
		
		}
	
	}
	
	
	
	
}
