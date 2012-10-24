package com.example.groepswekker;

import org.apache.cordova.api.Plugin;
import org.apache.cordova.api.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;
import android.telephony.TelephonyManager;

/**
 * This class echoes a string called from JavaScript.
 */
public class Plugins extends Plugin {

	/**
	 * Executes the request and returns PluginResult.
	 * 
	 * @param action
	 *            The action to execute.
	 * @param args
	 *            JSONArry of arguments for the plugin.
	 * @param callbackId
	 *            The callback id used when calling back into JavaScript.
	 * @return A PluginResult object with a status and message.
	 */
	public PluginResult execute(String action, JSONArray args, String callbackId) {
		if (action.equals("imei")) {
			String imei = getImei();
			if (imei != null && imei.length() > 0) {
				return new PluginResult(PluginResult.Status.OK, getImei());
			} else {
				return new PluginResult(PluginResult.Status.ERROR);
			}
		} else if (action.equals("wekker")) {
			try {
				String echo = args.getString(0);
				if (echo != null && echo.length() > 0) {
					return new PluginResult(PluginResult.Status.OK, wekker(echo));
				} else {
					return new PluginResult(PluginResult.Status.ERROR);
				}
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				return new PluginResult(PluginResult.Status.ERROR);
			}

		} else {
			return new PluginResult(PluginResult.Status.INVALID_ACTION);
		}
	}

	public String getImei() {
		TelephonyManager telephonyManager = (TelephonyManager) this.cordova
				.getActivity().getSystemService(Context.TELEPHONY_SERVICE);
		return telephonyManager.getDeviceId();
	}
	
	public String wekker(String input){
		if(input.equals("1030")){
			return "succes";
		} else {
			return "fail";
		}
		
		
	}

}
