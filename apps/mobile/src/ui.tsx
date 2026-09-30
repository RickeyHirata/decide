import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export const colors = { canvas:'#FFFFFF', ink:'#111214', muted:'#686A70', lime:'#ECF3CE', lilac:'#E9E1FF', brand:'#D5FF45', line:'#E5E5E8' };
export function DemoBanner(){return <View style={s.demo}><Text style={s.demoText}>ローカルデモ — サーバー未接続</Text></View>}
export function Screen({children}:PropsWithChildren){return <View style={s.screen}>{children}</View>}
export function PrimaryButton({label,onPress,disabled=false}:{label:string;onPress:()=>void;disabled?:boolean}){return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={({pressed})=>[s.primary,pressed&&{opacity:.72},disabled&&{opacity:.4}]}><Text style={s.primaryText}>{label}</Text></Pressable>}
export const s=StyleSheet.create({screen:{flex:1,backgroundColor:colors.canvas,paddingHorizontal:18,paddingTop:18},demo:{backgroundColor:'#FFF5C2',padding:8,borderRadius:8,marginBottom:14},demoText:{fontSize:12,fontWeight:'700',color:colors.ink,textAlign:'center'},eyebrow:{fontSize:14,fontWeight:'600',color:colors.muted,marginBottom:8},title:{fontSize:25,lineHeight:35,fontWeight:'800',color:colors.ink},body:{fontSize:16,lineHeight:24,color:colors.ink},primary:{minHeight:52,borderRadius:14,backgroundColor:colors.brand,alignItems:'center',justifyContent:'center',paddingHorizontal:18,marginTop:18},primaryText:{fontSize:16,fontWeight:'800',color:'#152000'}});
