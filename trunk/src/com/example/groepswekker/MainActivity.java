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
    
    HashMap<Integer, PendingIntent> alarmintentsG;
	HashMap<Integer, Intent> intentsG;
    AlarmManager amG;
	
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        super.init();
        
        this.alarmintents = new HashMap<Integer, PendingIntent>();
        this.intents = new HashMap<Integer, Intent>();
        this.am = (AlarmManager)getSystemService(Activity.ALARM_SERVICE);
        
        this.alarmintentsG = new HashMap<Integer, PendingIntent>();
        this.intentsG = new HashMap<Integer, Intent>();
        this.amG = (AlarmManager)getSystemService(Activity.ALARM_SERVICE);
        
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
    
    public void setAlarm(int id, String hour, String min, String groep){
    	System.out.println("hour" + hour);
    	System.out.println("groep" + groep);
    	int inthour = Integer.parseInt(hour);
    	int intmin = Integer.parseInt(min);
    	 
    	Calendar now = Calendar.getInstance();
    	
    	int nowhour = now.get(Calendar.HOUR_OF_DAY);
    	int nowmin = now.get(Calendar.MINUTE);
    	
    	Calendar tmp = (Calendar) now.clone();
    	//if( nowhour == inthour && nowmin == intmin )
    	// return;
    	
    	if(nowhour > inthour || (nowmin >= intmin && inthour <= nowhour )){
    		// volgende dag
    		System.out.println("volgende dag");
    		System.out.println("nowhour" + nowhour);
    		System.out.println("inthour" + inthour);
    		System.out.println("som = " + (24-(nowhour - inthour)));
    		tmp.add(Calendar.HOUR_OF_DAY, 24-(nowhour - inthour));
    	} else {
    		tmp.add(Calendar.HOUR_OF_DAY,  inthour - nowhour);
    	}
//    	if(nowmin >= intmin){
//			//volgende dag
//    		tmp.add(Calendar.MINUTE, 60-(nowmin - intmin));
		//} else {
			tmp.add(Calendar.MINUTE,  intmin - nowmin);
		//}
    	
    	System.out.println(tmp.get(Calendar.HOUR_OF_DAY));
    	System.out.println(tmp.get(Calendar.MINUTE));
    	
    	System.out.println("now timeinmil = " + now.getTimeInMillis());
    	System.out.println("new timeinmil = " + tmp.getTimeInMillis());
    	

    	tmp.set(Calendar.SECOND, 00);
    	
    	if(groep.equals("true")){
    		System.out.println("GROEP IS TRUE !!!!!!!");
    		 this.intentsG.put(id, new Intent(this, WekkerActivity.class));
    	     this.intentsG.get(id).putExtra("id", id);
    	     this.intentsG.get(id).putExtra("days", "no-repeat");
    	     this.intentsG.get(id).putExtra("groep", true);
    	     this.alarmintentsG.put(id, PendingIntent.getActivity(this, id, this.intentsG.get(id), PendingIntent.FLAG_CANCEL_CURRENT));
    	     this.amG.set(AlarmManager.RTC_WAKEUP, tmp.getTimeInMillis(), this.alarmintentsG.get(id));
    	} else {
    		System.out.println("GROEP IS FALSE !!!!!!!");
    		this.intents.put(id, new Intent(this, WekkerActivity.class));
            this.intents.get(id).putExtra("id", id);
            this.intents.get(id).putExtra("days", "no-repeat");
            this.intents.get(id).putExtra("groep", false);
            this.alarmintents.put(id, PendingIntent.getActivity(this, id, this.intents.get(id), PendingIntent.FLAG_CANCEL_CURRENT));
            this.am.set(AlarmManager.RTC_WAKEUP, tmp.getTimeInMillis(), this.alarmintents.get(id));	
    	}
    }
    
    public void setRepeatAlarm(int id, String hour, String min, String days, String groep){
    	System.out.println("REPEAT ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    	int inthour = Integer.parseInt(hour);
    	int intmin = Integer.parseInt(min);
    	System.out.println("groep" + groep);
    	String[] repDays = days.split(",");
    	
    	System.out.println("hour" + inthour);
    	System.out.println("min" + intmin);
    	
    	int calID = 0;

    	for(int i = 1; i < repDays.length; i++){
    		switch(i){case 0:calID=0;break;case 1:calID=Calendar.MONDAY;break;case 2:calID=Calendar.TUESDAY;break;case 3:calID=Calendar.WEDNESDAY;break;case 4:calID=Calendar.THURSDAY;break;
			case 5:calID=Calendar.FRIDAY;break;case 6:calID=Calendar.SATURDAY;break;case 7:calID=Calendar.SUNDAY;break;};
			System.out.println(calID);
    		System.out.println(repDays[i]);
    		if(Integer.parseInt(repDays[i]) == 1){
    			Calendar now = Calendar.getInstance();
    	    	
    	    	int nowhour = now.get(Calendar.HOUR_OF_DAY);
    	    	int nowmin = now.get(Calendar.MINUTE);
    	    	
    	    	//if() huidige dag gelijk is aan de intestellen dag doe + 1 week

    	    	Calendar tmp = (Calendar) now.clone();
    	    	tmp.set(Calendar.HOUR_OF_DAY, inthour); //hour
    	    	tmp.set(Calendar.MINUTE, intmin); //min
    	    	tmp.set(Calendar.DAY_OF_WEEK, calID);
    	    	System.out.println("dag1 = " + calID);
    	    	System.out.println("dag1 = " + now.get(Calendar.DAY_OF_WEEK));
    	    	if(calID < now.get(Calendar.DAY_OF_WEEK) || (calID == now.get(Calendar.DAY_OF_WEEK) && nowhour > inthour) || (calID == now.get(Calendar.DAY_OF_WEEK) && nowmin >= intmin && inthour <= nowhour)  ){
    	    		System.out.println("extra week");
    	    		tmp.add(Calendar.WEEK_OF_YEAR, 1);
    	    	}
    	    	//set day =========================
    			//tmp.add(Calendar.HOUR_OF_DAY, 12);	
    			//tmp.add(Calendar.MINUTE, 29);
    				
    	    	System.out.println("new hour = " + tmp.get(Calendar.HOUR_OF_DAY));
    	    	System.out.println("new min = " + tmp.get(Calendar.MINUTE));
    	    	
    	    	System.out.println("now timeinmil = " + now.getTimeInMillis());
    	    	System.out.println("new timeinmil = " + tmp.getTimeInMillis());
    	    	

    	    	tmp.set(Calendar.SECOND, 00);
    	    	
    	    	String id2 = Integer.toString(id);
    	    	id2 = "-" + id2 + i;
    	    	int id3 = Integer.parseInt(id2);
    	    	System.out.println(id3);
    	    	
    	    	if(groep.equals("true")){
    	    		this.intentsG.put(id3, new Intent(this, WekkerActivity.class));
    	    		this.intentsG.get(id3).putExtra("id", id3);
    	    		this.intentsG.get(id3).putExtra("days", days);
    	    		this.intentsG.get(id3).putExtra("groep", true);
    	    		this.alarmintentsG.put(id3, PendingIntent.getActivity(this, id3, this.intentsG.get(id3), PendingIntent.FLAG_CANCEL_CURRENT));
    	    		this.amG.setRepeating(AlarmManager.RTC_WAKEUP, tmp.getTimeInMillis(), 604800000, this.alarmintentsG.get(id3)); // 1 week = 604800000 // 1 min = 60000
    	    	} else {
    	    		this.intents.put(id3, new Intent(this, WekkerActivity.class));
    	    		this.intents.get(id3).putExtra("id", id3);
    	    		this.intents.get(id3).putExtra("days", days);
    	    		this.intents.get(id3).putExtra("groep", false);
    	    		this.alarmintents.put(id3, PendingIntent.getActivity(this, id3, this.intents.get(id3), PendingIntent.FLAG_CANCEL_CURRENT));
    	    		this.am.setRepeating(AlarmManager.RTC_WAKEUP, tmp.getTimeInMillis(), 604800000, this.alarmintents.get(id3)); // 1 week = 604800000 // 1 min = 60000
    	    	}
    		}
    	}
    }
    
    public void removeAlarm(int id, String groep){
    	if(groep == "true"){
    		if(this.alarmintentsG.containsKey(id) && this.intentsG.containsKey(id)){
        		this.am.cancel(this.alarmintentsG.get(id));
        		this.alarmintentsG.remove(id);
        		this.intentsG.remove(id);
        		// eventueel pending intents verwijderen
        	}
    	} else {
    		if(this.alarmintents.containsKey(id) && this.intents.containsKey(id)){
        		this.am.cancel(this.alarmintents.get(id));
        		this.alarmintents.remove(id);
        		this.intents.remove(id);
        		// eventueel pending intents verwijderen
        	}
    	}
    }
}
