package com.example.groepswekker;

import java.util.Calendar;
import java.util.HashMap;

import android.os.Bundle;
import android.app.Activity;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.telephony.TelephonyManager;
import android.view.Menu;
import org.apache.cordova.*;

public class MainActivity extends DroidGap {

	HashMap<Integer, PendingIntent> alarmintents;
	HashMap<Integer, Intent> intents;
    AlarmManager am;
	
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        super.init();
        
        this.alarmintents = new HashMap<Integer, PendingIntent>();
        this.intents = new HashMap<Integer, Intent>();
        this.am = (AlarmManager)getSystemService(Activity.ALARM_SERVICE);
        
        appView.addJavascriptInterface(this, "main");
        
        Bundle b = getIntent().getExtras();
        int id = b.getInt("action");
        if(id == 10){
        	super.loadUrl("file:///android_asset/www/contact.html?action=wekker");
        } else {
        	super.loadUrl("file:///android_asset/www/contact.html");
        }
    }
    
    public void test(){
    	System.out.println("test");
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.activity_main, menu);
        return true;
    }
    
    public String getImei(){
    	TelephonyManager telephonyManager = (TelephonyManager)getSystemService(Context.TELEPHONY_SERVICE);
    	return telephonyManager.getDeviceId();
    }
    
    public void setAlarm(int id, String hour, String min){
    	System.out.println("hour" + hour);
    	int inthour = Integer.parseInt(hour);
    	int intmin = Integer.parseInt(min);
    	
    	Calendar now = Calendar.getInstance();
    	
    	int nowhour = now.get(Calendar.HOUR_OF_DAY);
    	int nowmin = now.get(Calendar.MINUTE);
    	
    	Calendar tmp = (Calendar) now.clone();
    	//if( nowhour == inthour && nowmin == intmin )
    	// return;
    	
    	if(nowhour > inthour){
    		// volgende dag
    		System.out.println("volgende dag");
    		System.out.println("nowhour" + nowhour);
    		System.out.println("inthour" + inthour);
    		System.out.println("som = " + (24-(nowhour - inthour)));
    		tmp.add(Calendar.HOUR_OF_DAY, 24-(nowhour - inthour));
    	} else {
    		tmp.add(Calendar.HOUR_OF_DAY,  inthour - nowhour);
    	}
//    	if(nowmin > intmin){
//			//volgende dag
//    		tmp.add(Calendar.MINUTE, 60-(nowmin - intmin));
//		} else {
			tmp.add(Calendar.MINUTE,  intmin - nowmin);
//		}
    	
    	System.out.println(tmp.get(Calendar.HOUR_OF_DAY));
    	System.out.println(tmp.get(Calendar.MINUTE));
    	
    	System.out.println("now timeinmil = " + now.getTimeInMillis());
    	System.out.println("new timeinmil = " + tmp.getTimeInMillis());
    	

    	tmp.set(Calendar.SECOND, 00);
    	
        this.intents.put(id, new Intent(this, WekkerActivity.class));
        this.intents.get(id).putExtra("id", id);
        this.alarmintents.put(id, PendingIntent.getActivity(this, id, this.intents.get(id), PendingIntent.FLAG_CANCEL_CURRENT));
        this.am.set(AlarmManager.RTC_WAKEUP, tmp.getTimeInMillis(), this.alarmintents.get(id));
    }
    
    public void setRepeatAlarm(int id, String hour, String min, String[] days){

    }
    
    public void removeAlarm(int id){
    	if(this.alarmintents.containsKey(id) && this.intents.containsKey(id)){
    		this.am.cancel(this.alarmintents.get(id));
    		this.alarmintents.remove(id);
    		this.intents.remove(id);
    	}
    }
}
