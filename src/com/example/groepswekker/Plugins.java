package com.example.groepswekker;

import org.apache.cordova.api.Plugin;
import org.apache.cordova.api.PluginResult;
import org.json.JSONArray;
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
		} else {
			return new PluginResult(PluginResult.Status.INVALID_ACTION);
		}
	}

	public String getImei() {
		TelephonyManager telephonyManager = (TelephonyManager) this.cordova
				.getActivity().getSystemService(Context.TELEPHONY_SERVICE);
		return telephonyManager.getDeviceId();
	}
}
