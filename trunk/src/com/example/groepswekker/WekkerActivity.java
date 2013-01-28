package com.example.groepswekker;

import java.io.IOException;
import java.util.Calendar;
import java.util.HashMap;

import org.apache.cordova.DroidGap;

import android.app.Activity;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Bundle;
import android.view.MotionEvent;
import android.view.View;
import android.view.View.OnTouchListener;
import android.widget.Button;

public class WekkerActivity extends DroidGap {
    private MediaPlayer mMediaPlayer;
    int wekkerid;
    String days;
    Boolean groep;
    String snoozetime;
    
    HashMap<Integer, PendingIntent> alarmintents;
	HashMap<Integer, Intent> intents;
    AlarmManager am;
    
    HashMap<Integer, PendingIntent> alarmintentsG;
	HashMap<Integer, Intent> intentsG;
    AlarmManager amG;
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //this.requestWindowFeature(Window.FEATURE_NO_TITLE);
        //this.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
        //        WindowManager.LayoutParams.FLAG_FULLSCREEN);
        super.init();
        
        this.alarmintents = new HashMap<Integer, PendingIntent>();
        this.intents = new HashMap<Integer, Intent>();
        this.am = (AlarmManager)getSystemService(Activity.ALARM_SERVICE);
        
        this.alarmintentsG = new HashMap<Integer, PendingIntent>();
        this.intentsG = new HashMap<Integer, Intent>();
        this.amG = (AlarmManager)getSystemService(Activity.ALARM_SERVICE);
        
        appView.addJavascriptInterface(this, "wekker");
        
        Bundle b = getIntent().getExtras();
        this.wekkerid = b.getInt("id");
        this.days = b.getString("days");
        this.groep = b.getBoolean("groep");
        this.snoozetime = b.getString("snoozetime");
        
        System.out.println("wekker id " + this.wekkerid);
        
        super.loadUrl("file:///android_asset/www/myalarmstop.html");
        
        
        
        
//        setContentView(R.layout.alarm);   
// 
//        Button stopAlarm = (Button) findViewById(R.id.stopAlarm);
//        stopAlarm.setOnTouchListener(new OnTouchListener() {
//            public boolean onTouch(View arg0, MotionEvent arg1) {
//                mMediaPlayer.stop();
//                Intent myIntent = new Intent(WekkerActivity.this, MainActivity.class);
//                myIntent.setFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
//                //myIntent.putExtra("action", 10);
//                WekkerActivity.this.startActivity(myIntent);
//                finish();
//                return false;
//            }
//        });
        
 
        playSound(this, getAlarmUri());
        
    }
    
    public String getData(){
    	return this.wekkerid + "/" + this.days + "/" + this.groep + "/" + this.snoozetime;
    }
    
    public boolean stopAlarm() {
        mMediaPlayer.stop();
        Intent myIntent = new Intent(WekkerActivity.this, MainActivity.class);
        myIntent.setFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
        WekkerActivity.this.startActivity(myIntent);
        finish();
        return false;
    }
    
    public void pauzeAlarm() {
        mMediaPlayer.stop();
        Intent myIntent = new Intent(WekkerActivity.this, MainActivity.class);
        myIntent.setFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
        WekkerActivity.this.startActivity(myIntent);
        //return false;
    }
	    
    private void playSound(Context context, Uri alert) {
        mMediaPlayer = new MediaPlayer();
        try {
            mMediaPlayer.setDataSource(context, alert);
            final AudioManager audioManager = (AudioManager) context
                    .getSystemService(Context.AUDIO_SERVICE);
            if (audioManager.getStreamVolume(AudioManager.STREAM_ALARM) != 0) {
                mMediaPlayer.setAudioStreamType(AudioManager.STREAM_ALARM);
                mMediaPlayer.prepare();
                mMediaPlayer.start();
            }
        } catch (IOException e) {
            System.out.println("MediaPlayer Error");
        }
    }

        //Get an alarm sound. Try for an alarm. If none set, try notification,
        //Otherwise, ringtone.
    private Uri getAlarmUri() {
        Uri alert = RingtoneManager
                .getDefaultUri(RingtoneManager.TYPE_ALARM);
        if (alert == null) {
            alert = RingtoneManager
                    .getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
            if (alert == null) {
                alert = RingtoneManager
                        .getDefaultUri(RingtoneManager.TYPE_RINGTONE);
            }
        }
        return alert;
    }
    
    public void setAlarm(int id, String hour, String min, String groep, String snoozetime){
    	System.out.println("hour" + hour);
    	System.out.println("min" + min);
    	System.out.println("groep" + groep);
    	System.out.println("snoozetime" + snoozetime);
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
    	     this.intentsG.get(id).putExtra("snoozetime", snoozetime);
    	     this.alarmintentsG.put(id, PendingIntent.getActivity(this, id, this.intentsG.get(id), PendingIntent.FLAG_CANCEL_CURRENT));
    	     this.amG.set(AlarmManager.RTC_WAKEUP, tmp.getTimeInMillis(), this.alarmintentsG.get(id));
    	} else {
    		System.out.println("GROEP IS FALSE !!!!!!!");
    		this.intents.put(id, new Intent(this, WekkerActivity.class));
            this.intents.get(id).putExtra("id", id);
            this.intents.get(id).putExtra("days", "no-repeat");
            this.intents.get(id).putExtra("groep", false);
            this.intents.get(id).putExtra("snoozetime", snoozetime);
            this.alarmintents.put(id, PendingIntent.getActivity(this, id, this.intents.get(id), PendingIntent.FLAG_CANCEL_CURRENT));
            this.am.set(AlarmManager.RTC_WAKEUP, tmp.getTimeInMillis(), this.alarmintents.get(id));	
    	}
    	System.out.println("doe je het nog ??");
    }
}
